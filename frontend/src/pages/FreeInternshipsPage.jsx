import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Award,
  CheckCircle,
  Building,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Globe,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Info,
  X,
  AlertCircle
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import {
  getFreeInternships,
  addFreeInternship,
  updateFreeInternship,
  deleteFreeInternship,
  toggleFreeInternshipActive
} from "../services/api";

export default function FreeInternshipsPage() {
  const { isAdmin, userRole } = useStudent();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [includeAll, setIncludeAll] = useState(false);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    domain: "Software Engineering",
    duration: "3 - 6 Months",
    stipend_type: "Paid Stipend",
    stipend_amount: "₹25,000 / month",
    eligibility: "Currently enrolled B.Tech/BE/MCA/B.Sc college students",
    application_deadline: "Rolling / Open Throughout Year",
    official_source: "",
    apply_url: "",
    source_url: "",
    free_to_apply: true,
    verification_status: "Verified Official"
  });

  useEffect(() => {
    loadOpportunities();
  }, [includeAll, isAdmin]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getFreeInternships(includeAll && isAdmin, userRole);
      if (res?.success) {
        setOpportunities(res.data || []);
      } else {
        setError(res?.error || "Failed to load internship opportunities.");
      }
    } catch (err) {
      setError(err.message || "Unable to reach internship server.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNow = (url, title, org) => {
    if (!url) return;
    // Always open official external website in a fresh tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Admin Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormError("");
    setFormData({
      title: "",
      organization: "",
      domain: "Software Engineering",
      duration: "3 - 6 Months",
      stipend_type: "Paid Stipend",
      stipend_amount: "₹25,000 / month",
      eligibility: "Currently enrolled B.Tech/BE/MCA/B.Sc college students",
      application_deadline: "Rolling / Open Throughout Year",
      official_source: "",
      apply_url: "",
      source_url: "",
      free_to_apply: true,
      verification_status: "Verified Official"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (opp) => {
    setEditingItem(opp);
    setFormError("");
    setFormData({
      title: opp.title || "",
      organization: opp.organization || "",
      domain: opp.domain || "",
      duration: opp.duration || "",
      stipend_type: opp.stipend_type || "Paid Stipend",
      stipend_amount: opp.stipend_amount || "",
      eligibility: opp.eligibility || "",
      application_deadline: opp.application_deadline || "",
      official_source: opp.official_source || "",
      apply_url: opp.apply_url || "",
      source_url: opp.source_url || "",
      free_to_apply: opp.free_to_apply ?? true,
      verification_status: opp.verification_status || "Verified Official"
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim() || !formData.apply_url.trim()) {
      setFormError("Title, organization, and official apply URL are required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError("");
      if (editingItem) {
        await updateFreeInternship(editingItem.id, formData, "admin");
      } else {
        await addFreeInternship(formData, "admin");
      }
      setIsModalOpen(false);
      loadOpportunities();
    } catch (err) {
      setFormError(err.message || "Failed to save internship opportunity.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleFreeInternshipActive(id, "admin");
      loadOpportunities();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteFreeInternship(id, "admin");
      loadOpportunities();
    } catch (err) {
      alert("Error deleting opportunity: " + err.message);
    }
  };

  return (
    <div className="free-internships-page" style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "50px" }}>
      {/* Top Hero Banner */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #101B35 0%, #1D3B70 100%)",
          color: "#ffffff",
          padding: "26px 28px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px -5px rgba(16, 27, 53, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ maxWidth: "750px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(37, 99, 235, 0.25)",
                  color: "#93C5FD",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(147, 197, 253, 0.3)"
                }}
              >
                <CheckCircle size={13} /> 100% Free Applications • Zero Fees
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  color: "#6EE7B7",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(110, 231, 183, 0.3)"
                }}
              >
                <ShieldCheck size={13} /> Official Sources Verified
              </span>
            </div>

            <h1 style={{ fontSize: "1.55rem", fontWeight: 800, margin: "0 0 6px 0", letterSpacing: "0.2px" }}>
              Free Internship Opportunities
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#B8C4D9", lineHeight: 1.5, margin: 0 }}>
              Directly apply to verified, authentic, 100% free internship programs across leading technology enterprises and government research bodies. All opportunities are pre-screened with no hidden application costs. Click <strong>Apply Now</strong> to proceed directly on the official host website.
            </p>
          </div>

          {isAdmin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="btn"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)"
                }}
              >
                <Plus size={16} /> Add Opportunity (Admin)
              </button>

              <label style={{ fontSize: "0.75rem", color: "#B8C4D9", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={includeAll}
                  onChange={(e) => setIncludeAll(e.target.checked)}
                />
                Show Inactive / Past Opportunities
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Info Notice Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          marginBottom: "22px",
          fontSize: "0.82rem",
          color: "#475569"
        }}
      >
        <Info size={16} color="#2563eb" flexShrink={0} />
        <span>
          Showing <strong>{opportunities.length}</strong> verified opportunities. Applications are processed directly on official corporate and government portals. DATA VISTA does not charge or collect fees.
        </span>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="spin" style={{ width: "32px", height: "32px", border: "3px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>Loading verified free internship opportunities...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <AlertCircle size={36} color="#dc2626" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: "1.05rem", color: "#991b1b", marginBottom: "6px" }}>Failed to Load Opportunities</h3>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>{error}</p>
          <button type="button" onClick={loadOpportunities} className="btn btn-secondary btn-sm" style={{ marginTop: "10px" }}>
            Retry
          </button>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "50px 20px" }}>
          <Award size={40} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-navy)", marginBottom: "4px" }}>
            No Active Opportunities Listed Right Now
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
            Check back soon as new verified corporate and government internship cohorts open.
          </p>
        </div>
      ) : (
        /* Opportunities Cards Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "22px"
          }}
        >
          {opportunities.map((opp) => {
            const isPaid = (opp.stipend_type || "").toLowerCase().includes("paid");
            const isUnpaid = (opp.stipend_type || "").toLowerCase().includes("unpaid");

            return (
              <div
                key={opp.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "22px",
                  borderRadius: "12px",
                  border: opp.is_active ? "1px solid #e2e8f0" : "1px dashed #cbd5e1",
                  opacity: opp.is_active ? 1 : 0.7,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  position: "relative"
                }}
              >
                <div>
                  {/* Card Header: Organization & Verification Badges */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "8px",
                          backgroundColor: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: "var(--primary-navy)",
                          flexShrink: 0
                        }}
                      >
                        {opp.organization.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {opp.organization}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: "#059669",
                              backgroundColor: "#ecfdf5",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px"
                            }}
                          >
                            <CheckCircle size={11} /> 100% Free Application
                          </span>
                        </div>
                      </div>
                    </div>

                    {opp.verification_status && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#1d4ed8",
                          backgroundColor: "#eff6ff",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {opp.verification_status}
                      </span>
                    )}
                  </div>

                  {/* Internship Name / Title */}
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--primary-navy)",
                      margin: "0 0 10px 0",
                      lineHeight: 1.35
                    }}
                  >
                    {opp.title}
                  </h3>

                  {/* Domain Tag */}
                  <div style={{ marginBottom: "14px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "#f8fafc",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        padding: "3px 8px",
                        borderRadius: "4px"
                      }}
                    >
                      {opp.domain}
                    </span>
                  </div>

                  {/* Key Metadata Details Grid */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      padding: "12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      fontSize: "0.82rem"
                    }}
                  >
                    {/* Stipend Information */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <DollarSign size={15} color={isPaid ? "#16a34a" : "#7c3aed"} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>Stipend: </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isPaid ? "#15803d" : isUnpaid ? "#6d28d9" : "#0284c7"
                          }}
                        >
                          {opp.stipend_amount || (isPaid ? "Paid Stipend" : "Unpaid / Learning")}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "4px" }}>
                          ({opp.stipend_type})
                        </span>
                      </div>
                    </div>

                    {/* Duration */}
                    {opp.duration && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={15} color="#475569" style={{ flexShrink: 0 }} />
                        <div>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>Duration: </span>
                          <span style={{ color: "#334155" }}>{opp.duration}</span>
                        </div>
                      </div>
                    )}

                    {/* Eligibility */}
                    {opp.eligibility && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <GraduationCap size={15} color="#475569" style={{ marginTop: "2px", flexShrink: 0 }} />
                        <div style={{ lineHeight: 1.4 }}>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>Eligibility: </span>
                          <span style={{ color: "#334155" }}>{opp.eligibility}</span>
                        </div>
                      </div>
                    )}

                    {/* Application Deadline */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={15} color="#d97706" style={{ flexShrink: 0 }} />
                      <div>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>Application Deadline: </span>
                        <span style={{ color: "#b45309", fontWeight: 600 }}>
                          {opp.application_deadline || "Rolling / Open Throughout Year"}
                        </span>
                      </div>
                    </div>

                    {/* Official Website / Source */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Globe size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                      <div>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>Official Portal: </span>
                        <span style={{ color: "#2563eb", fontWeight: 500 }}>
                          {opp.official_source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleApplyNow(opp.apply_url, opp.title, opp.organization)}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      borderRadius: "8px",
                      backgroundColor: "#2563eb",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)"
                    }}
                    title="Opens official application website in a new browser tab"
                  >
                    <span>Apply Now</span>
                    <ExternalLink size={16} />
                  </button>

                  <div style={{ textAlign: "center", marginTop: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Opens official application portal in a new tab
                    </span>
                  </div>

                  {/* Admin inline management buttons */}
                  {isAdmin && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid #f1f5f9"
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleActive(opp.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                        title="Toggle active status"
                      >
                        {opp.is_active ? "Deactivate" : "Activate"}
                      </button>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(opp)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px" }}
                          title="Edit Opportunity"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opp.id, opp.title)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px", color: "#dc2626" }}
                          title="Delete Opportunity"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "26px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--primary-navy)", margin: 0 }}>
                {editingItem ? "Edit Free Internship Opportunity" : "Add Free Internship Opportunity"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "#fef2f2",
                  color: "#b91c1c",
                  fontSize: "0.82rem",
                  marginBottom: "14px",
                  border: "1px solid #fecaca"
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Internship Name / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Summer Internship"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / ISRO / Microsoft"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Internship Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering, AI/ML"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Months, 8 - 12 Weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Stipend Type *
                  </label>
                  <select
                    value={formData.stipend_type}
                    onChange={(e) => setFormData({ ...formData, stipend_type: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                  >
                    <option value="Paid Stipend">Paid Stipend</option>
                    <option value="Unpaid / Learning & Research">Unpaid / Learning & Research</option>
                    <option value="Performance Stipend">Performance Stipend</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Stipend Information
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 / month or Unpaid (Free Certificate)"
                    value={formData.stipend_amount}
                    onChange={(e) => setFormData({ ...formData, stipend_amount: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Eligibility
                </label>
                <input
                  type="text"
                  placeholder="e.g. Currently enrolled B.Tech/BE/MCA/B.Sc college students"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-12-31 or Rolling / Open Throughout Year"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Official Website / Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Careers Portal"
                    value={formData.official_source}
                    onChange={(e) => setFormData({ ...formData, official_source: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                  Official Application URL (Opens when student clicks Apply Now) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://careers.google.com/students/"
                  value={formData.apply_url}
                  onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-primary"
                >
                  {formSubmitting ? "Saving..." : editingItem ? "Update Opportunity" : "Publish Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
