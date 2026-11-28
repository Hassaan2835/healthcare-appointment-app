"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";

// Day 20: profile picture upload. Shows the current picture (or the
// user's initials when there is none), previews the chosen file
// before it is sent, and posts it to POST /api/profile/avatar as
// multipart form data. The remove button calls DELETE on the same
// route. The page refreshes after a successful change so the rest of
// the profile shows the new picture.
export default function AvatarUpload({ initialImage, userName }) {
  const [image, setImage] = useState(initialImage || null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const initials = (userName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function handleChoose(event) {
    const chosen = event.target.files?.[0];
    setMessage("");
    setError("");
    if (!chosen) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(chosen.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (chosen.size > 2 * 1024 * 1024) {
      setError("The image is too large. Please choose one under 2 MB.");
      return;
    }
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  async function handleUpload() {
    if (!file) return;
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }
      setImage(data.image);
      setPreview(null);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Profile picture updated.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile/avatar", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not remove the picture. Please try again.");
        return;
      }
      setImage(null);
      setPreview(null);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("Profile picture removed.");
    } catch {
      setError("Could not remove the picture. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const shown = preview || image;

  return (
    <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-navy-800/70 dark:shadow-card sm:flex-row sm:items-center">
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shown}
          alt="Your profile picture"
          className="h-24 w-24 shrink-0 rounded-full border-2 border-mint-400/60 object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-navy-900 text-2xl font-bold text-mint-300 dark:bg-mint-400 dark:text-navy-950">
          {initials}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile picture</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          JPG, PNG or WebP, up to 2 MB. Your picture is shown on your profile.
        </p>
        {message && (
          <p className="mt-3 rounded-xl border border-mint-500/30 bg-mint-400/10 px-4 py-2 text-sm text-mint-600 dark:text-mint-300">{message}</p>
        )}
        {error && (
          <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-300">{error}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChoose}
            className="hidden"
            aria-label="Choose a profile picture"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {image || preview ? "Choose a new picture" : "Choose a picture"}
          </Button>
          {file && (
            <Button type="button" loading={loading} onClick={handleUpload}>
              {loading ? "Uploading..." : "Upload picture"}
            </Button>
          )}
          {image && !file && (
            <Button type="button" variant="outline" loading={loading} onClick={handleRemove}>
              {loading ? "Removing..." : "Remove picture"}
            </Button>
          )}
        </div>
        {file && (
          <p className="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">
            Selected: {file.name}
          </p>
        )}
      </div>
    </div>
  );
}
