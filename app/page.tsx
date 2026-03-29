"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    performers: "",
    album: "",
    year: "",
    singer: "",
    writer: "",
    length: "",
    image: ""   
  });

  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // ===== LOAD =====
  const fetchSongs = async () => {
    const res = await fetch("/api/songs");
    const data = await res.json();
    setSongs(data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // ===== ADD / UPDATE =====
  const saveSong = async () => {
    if (editIndex !== null) {
      await fetch("/api/songs", {
        method: "PUT",
        body: JSON.stringify({
          index: editIndex,
          updatedSong: form
        })
      });
      setEditIndex(null);
    } else {
      await fetch("/api/songs", {
        method: "POST",
        body: JSON.stringify(form)
      });
    }

    setForm({
      title: "",
      performers: "",
      album: "",
      year: "",
      singer: "",
      writer: "",
      length: "",
      image: ""
    });

    fetchSongs();
  };

  // ===== DELETE =====
  const deleteSong = async (index: number) => {
    await fetch("/api/songs", {
      method: "DELETE",
      body: JSON.stringify({ index })
    });
    fetchSongs();
  };

  // ===== START EDIT =====
  const startEdit = (index: number) => {
    const song = songs[index];

    setForm({
      title: song.title,
      performers: song.performers,
      album: song.album,
      year: song.year,
      singer: song.singer,
      writer: song.writer,
      length: song.length,
      image: song.image || ""
    });

    setEditIndex(index);
  };

  // ===== SEARCH FILTER =====
  const filtered = songs.filter((s: any) =>
    Object.values(s).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className={dark ? "bg-gray-900 text-white min-h-screen p-6" : "p-6"}>

      <h1 className="text-3xl font-bold mb-4">🎵🎼 My Song Catalog</h1>

      {/* DARK MODE */}
      <button
        onClick={() => setDark(!dark)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Dark Mode
      </button>

      {/* FORM */}
      <div className="mb-4">

  {/* TEXT INPUTS */}
  <div className="grid grid-cols-5 gap-2">
    {["title","performers","album","year","singer(s)","writer(s)","length"].map((key) => (
      <input
        key={key}
        value={(form as any)[key]}
        placeholder={key}
        className="border p-2 rounded text-black"
        onChange={(e) =>
          setForm({ ...form, [key]: e.target.value })
        }
      />
    ))}
  </div>

  {/* 🖼️ FILE UPLOAD GOES RIGHT HERE */}
  <div className="mt-4">
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        setForm({ ...form, image: data.url });
      }}
    />

    {/* 👀 PREVIEW */}
    {form.image && (
    <img
      src={form.image}
      alt="preview"
      className="w-24 h-24 object-cover rounded mt-2"
    />
  )}
  </div>

</div>

      {/* SAVE BUTTON */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={saveSong}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editIndex !== null ? "Update Song" : "Add Song"}
        </button>

        {/* CANCEL BUTTON */}
        {editIndex !== null && (
          <button
            onClick={() => {
              setEditIndex(null);
              setForm({
                title: "",
                performers: "",
                album: "",
                year: "",
                singer: "",
                writer: "",
                length: "",
                image: ""
              });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        className="border p-2 w-full mb-4 text-black"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filtered.map((song, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg hover:scale-105 transition transform"
          >
            {/* 🖼️ Album Art */}
            <div className="relative group">
              <img
                src={song.image || "/placeholder.png"}
                className="w-full h-40 object-cover rounded-lg"
              />

  {/* 🔥 HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg">
                <span className="text-white font-bold text-lg">Edit</span>
              </div>
          </div>

            {/* 🎵 Info */}
            <h2 className="font-bold text-lg mt-3">{song.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {song.performers}
            </p>
            <p className="text-xs text-gray-400">{song.album} • {song.year}</p>

            {/* 🎛️ Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => startEdit(i)}
                className="flex-1 bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSong(i)}
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}