import { useEffect, useState } from "react";
import api from "../services/api";

export default function Settings() {
  // ============================================================
  // STATE
  // ============================================================

  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/maintenance");

        if (!isMounted) {
          return;
        }

        setEnabled(Boolean(response.data.enabled));
        setMessage(response.data.message || "");
      } catch (error) {
        console.error("Failed to load maintenance settings:", error);

        if (isMounted) {
          setError("Unable to load website settings.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const saveSettings = async () => {
    // Prevent duplicate requests
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.put("/maintenance", {
        enabled,
        message,
      });

      alert("Settings updated successfully.");
    } catch (error) {
      console.error("Failed to update maintenance settings:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to update settings.");
      } else {
        alert("Failed to update settings. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-600">Loading website settings...</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SETTINGS UI
  // ============================================================

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Maintenance Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          disabled={saving}
          className="w-4 h-4"
        />

        <span className="font-medium">Enable Maintenance Mode</span>
      </div>

      {/* Maintenance Message */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Maintenance Message</label>

        <textarea
          className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          rows="4"
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={saving}
          placeholder="Enter maintenance message..."
        />

        <div className="text-right text-sm text-gray-500 mt-1">
          {message.length}/500
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        disabled={saving}
        className={`px-6 py-2 rounded text-white transition ${
          saving
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
