import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  LayoutDashboard,
  Settings,
  Boxes,
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061529]">
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#07152D] via-[#0A326D] to-[#04111F]" />

      <div className="absolute -left-32 -top-32 w-[420px] h-[420px] rounded-full bg-blue-500/20 blur-[140px]" />

      <div className="absolute right-0 bottom-0 w-[450px] h-[450px] rounded-full bg-orange-500/20 blur-[150px]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-10">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:grid-cols-2">
          {/* ================= LEFT PANEL ================= */}

          <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#081C3A] via-[#0D3B7A] to-[#061529] p-12 text-white">
            {/* Top Section */}

            <div className="flex flex-col items-center text-center">
              {/* Logo */}

              <div className="mb-8">
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-2xl ring-8 ring-white/10">
                  <img
                    src="/log-guru.png"
                    alt="Gurukrupa Enterprises"
                    className="h-24 w-auto object-contain"
                  />
                </div>
              </div>

              <span className="rounded-full border border-orange-400/30 bg-orange-500/15 px-5 py-2 text-sm font-medium text-orange-200">
                Enterprise Administration Portal
              </span>

              <h1 className="mt-8 text-5xl font-bold leading-tight">
                Welcome Back
              </h1>

              <p className="mt-5 max-w-md text-lg leading-8 text-blue-100">
                Securely manage your products, categories, inventory and website
                settings from one professional dashboard.
              </p>
            </div>
            {/* Feature Cards */}

            <div className="mt-12 grid gap-5">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <div className="rounded-xl bg-orange-500 p-3">
                  <Boxes size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">Product Management</h3>

                  <p className="mt-1 text-sm text-blue-100">
                    Add, edit and organize products effortlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <div className="rounded-xl bg-blue-500 p-3">
                  <LayoutDashboard size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">Powerful Dashboard</h3>

                  <p className="mt-1 text-sm text-blue-100">
                    Track and manage your entire business from one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <div className="rounded-xl bg-green-500 p-3">
                  <Settings size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">Website Settings</h3>

                  <p className="mt-1 text-sm text-blue-100">
                    Control maintenance mode and website configuration.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}

            <div className="mt-10 border-t border-white/20 pt-6">
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-orange-400" />

                <span className="font-medium">Gurukrupa Enterprises</span>
              </div>

              <p className="mt-2 text-sm text-blue-100">
                Secure • Reliable • Professional
              </p>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="flex items-center justify-center bg-white px-10 py-12 lg:px-20">
            <div className="w-full max-w-md">
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                ADMIN LOGIN
              </span>

              <h2 className="mt-6 text-4xl font-bold text-gray-900">
                Sign in to your account
              </h2>

              <p className="mt-3 text-gray-500">
                Enter your credentials to access the Admin Dashboard.
              </p>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-700"
                    />

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 text-gray-700 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="group relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-700"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-14 text-gray-700 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-blue-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                    />
                    Remember Me
                  </label>

                  {/* <button
                    type="button"
                    className="text-sm font-medium text-blue-700 transition hover:text-orange-500"
                  >
                    Forgot Password?
                  </button> */}
                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0A3C8C] to-[#081C3A] py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        size={20}
                        className="transition-transform duration-300 group-hover:translate-x-2"
                      />
                    </>
                  )}
                </button>

                {/* Divider */}

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200"></div>

                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    Secure Access
                  </span>

                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                {/* Security Points */}

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-green-600" />
                    Encrypted authentication
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-green-600" />
                    Authorized administrators only
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-green-600" />
                    Protected dashboard access
                  </div>
                </div>
                {/* Need Help */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={22} className="mt-1 text-blue-700" />

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Need Help?
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        If you're experiencing login issues or have forgotten
                        your credentials, please contact with{" "}
                        <b>@ RushiStack Technologies</b>
                      </p>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}

              <div className="mt-5 border-t border-gray-200 pt-6 text-center">
                <img
                  src="/log-guru.png"
                  alt="Gurukrupa Enterprises"
                  className="mx-auto mb-0 h-24 w-auto"
                />

                {/* <h3 className="font-semibold text-gray-800">
                  Gurukrupa Enterprises
                </h3> */}

                <p className="mt-2 text-sm text-gray-500">
                  Enterprise Administration Portal
                </p>

                <p className="mt-5 text-xs text-gray-400">
                  © {new Date().getFullYear()} Gurukrupa Enterprises.
                  <br />
                  All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
