import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../contexts/auth/useAuth");
vi.mock("axios");
vi.mock("react-router-dom");
vi.mock("moment");

vi.mock("../components/DeleteCommentModal", () => ({
  default: ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-comment-modal">
        <button onClick={onConfirm} data-testid="confirm-delete-button">
          Confirm
        </button>
        <button onClick={onClose} data-testid="cancel-delete-button">
          Cancel
        </button>
      </div>
    );
  },
}));

import CommentList from "../components/CommentList";
import useAuth from "../contexts/auth/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

describe("CommentList", () => {
  const mockComments = [
    {
      _id: "1",
      text: "This is a test comment 1.",
      author: { _id: "user123", username: "testuser" },
      createdAt: "2023-01-01T10:00:00Z",
    },
    {
      _id: "2",
      text: "Another comment by someone else.",
      author: { _id: "user456", username: "anotheruser" },
      createdAt: "2023-01-02T11:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { userId: "user123", username: "testuser" },
    });
    vi.mocked(useParams).mockReturnValue({ id: "post123" });
    vi.mocked(axios.patch).mockResolvedValue({ data: { data: {} } });
    vi.mocked(axios.delete).mockResolvedValue({});
    vi.mocked(moment).mockReturnValue({ fromNow: () => "2 days ago" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- Test Cases ---

  test("renders 'No comments yet.' when initialComments is empty", () => {
    render(<CommentList comments={[]} />);
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  test("renders comments passed in initialComments prop", () => {
    render(<CommentList comments={mockComments} />);
    expect(screen.getByText("This is a test comment 1.")).toBeInTheDocument();
    expect(
      screen.getByText("Another comment by someone else.")
    ).toBeInTheDocument();
    expect(screen.getAllByText("testuser")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2 days ago")[0]).toBeInTheDocument();
  });

  test("displays edit and delete buttons for comments authored by the current user", () => {
    render(<CommentList comments={mockComments} />);

    const comment1Element = screen
      .getByText("This is a test comment 1.")
      .closest(".flex-1");

    const withinComment1 = within(comment1Element);

    expect(
      withinComment1.getByRole("button", { name: "Edit Comment" })
    ).toBeInTheDocument();
    expect(
      withinComment1.getByRole("button", { name: "Delete Comment" })
    ).toBeInTheDocument();

    const comment2Element = screen
      .getByText("Another comment by someone else.")
      .closest(".flex-1");

    const withinComment2 = within(comment2Element);

    expect(
      withinComment2.queryByRole("button", { name: "Edit Comment" })
    ).not.toBeInTheDocument();
    expect(
      withinComment2.queryByRole("button", { name: "Delete Comment" })
    ).not.toBeInTheDocument();
  });

  test("allows user to edit their own comment", async () => {
    render(<CommentList comments={mockComments} />);

    const editButton = screen.getByLabelText("Edit Comment");
    fireEvent.click(editButton);

    const textarea = screen.getByDisplayValue("This is a test comment 1.");
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Updated comment text." } });
    expect(textarea).toHaveValue("Updated comment text.");

    vi.mocked(axios.patch).mockResolvedValueOnce({
      data: {
        data: {
          _id: "1",
          text: "Updated comment text.",
          author: { _id: "user123", username: "testuser" },
          createdAt: "2023-01-01T10:00:00Z",
        },
      },
    });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith("posts/post123/comments/1", {
        text: "Updated comment text.",
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("Updated comment text.")
      ).not.toBeInTheDocument();
      expect(screen.getByText("Updated comment text.")).toBeInTheDocument();
    });
  });

  test("allows user to cancel editing a comment", async () => {
    render(<CommentList comments={mockComments} />);

    const editButton = screen.getByLabelText("Edit Comment");
    fireEvent.click(editButton);

    const textarea = screen.getByDisplayValue("This is a test comment 1.");
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, {
      target: { value: "This text should not be saved." },
    });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(textarea).not.toBeInTheDocument();
      expect(screen.getByText("This is a test comment 1.")).toBeInTheDocument();
    });
    expect(axios.patch).not.toHaveBeenCalled();
  });

  test("handles comment deletion correctly", async () => {
    const fetchComments = vi.fn();
    render(
      <CommentList comments={mockComments} fetchComments={fetchComments} />
    );

    const deleteButton = screen.getByLabelText("Delete Comment");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("delete-comment-modal");
    expect(modal).toBeInTheDocument();

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("posts/post123/comments/1");
    });

    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
      expect(
        screen.queryByText("This is a test comment 1.")
      ).not.toBeInTheDocument();
      expect(fetchComments).toHaveBeenCalledTimes(1);
    });
  });

  test("cancels comment deletion when cancel button in modal is clicked", async () => {
    const fetchComments = vi.fn();
    render(
      <CommentList comments={mockComments} fetchComments={fetchComments} />
    );

    const deleteButton = screen.getByLabelText("Delete Comment");
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId("delete-comment-modal");
    expect(modal).toBeInTheDocument();

    const cancelButton = screen.getByTestId("cancel-delete-button");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });
    expect(axios.delete).not.toHaveBeenCalled();
    expect(fetchComments).not.toHaveBeenCalled();
    expect(screen.getByText("This is a test comment 1.")).toBeInTheDocument();
  });

  test("updates comments when initialComments prop changes (via useEffect)", () => {
    const { rerender } = render(<CommentList comments={[]} />);
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();

    const newComments = [
      {
        _id: "3",
        text: "A brand new comment.",
        author: { _id: "user789", username: "newuser" },
        createdAt: "2023-01-03T12:00:00Z",
      },
    ];

    rerender(<CommentList comments={newComments} />);

    expect(screen.queryByText("No comments yet.")).not.toBeInTheDocument();
    expect(screen.getByText("A brand new comment.")).toBeInTheDocument();
  });
});
