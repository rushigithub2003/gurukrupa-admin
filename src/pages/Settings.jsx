import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/maintenance";

export default function Settings() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await axios.get(API);
    setEnabled(res.data.enabled);
    setMessage(res.data.message);
  };

  const saveSettings = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    await axios.put(
      API,
      {
        enabled,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Settings updated successfully.");
  } catch (error) {
    console.error(error);

    if (error.response?.status === 401) {
      alert("Session expired. Please login again.");
    } else {
      alert("Failed to update settings.");
    }
  }
};

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        Website Settings
      </h1>

      <div className="mb-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />

        <span className="font-medium">
          Enable Maintenance Mode
        </span>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Maintenance Message
        </label>

        <textarea
          className="w-full border rounded p-3"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}