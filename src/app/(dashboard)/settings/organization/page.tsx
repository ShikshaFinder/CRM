"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  owner: {
    id: string;
    email: string;
    profile: {
      fullName: string | null;
    } | null;
  };
}

export default function OrganizationSettingsPage() {
  const { data: session } = useSession();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const organizationId = session?.user?.currentOrganizationId;
  const isOwner = organization?.ownerId === session?.user?.id;
  const isAdmin =
    session?.user?.currentOrganizationRole === "ADMIN" ||
    session?.user?.currentOrganizationRole === "OWNER";

  useEffect(() => {
    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const fetchOrganization = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/organizations/${organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
        setFormData({ name: data.name });
      } else {
        setError("Failed to load organization");
      }
    } catch (err) {
      setError("Failed to load organization");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !isAdmin) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      if (response.ok) {
        await fetchOrganization();
        setIsEditing(false);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update organization");
      }
    } catch (err) {
      alert("Error updating organization");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="p-8">
        <div className="text-red-600">{error || "Organization not found"}</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Organization Settings
        </h1>
        <p className="text-zinc-600">
          Manage your organization details and preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-black/8 rounded-lg p-6 space-y-6"
      >
        {!isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Organization Name
              </label>
              <p className="text-lg text-black">{organization.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Organization Slug
              </label>
              <p className="text-zinc-600 font-mono text-sm">
                {organization.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Owner
              </label>
              <p className="text-zinc-600">
                {organization.owner.profile?.fullName || organization.owner.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Created
              </label>
              <p className="text-zinc-600">
                {new Date(organization.createdAt * 1000).toLocaleDateString()}
              </p>
            </div>

            {isAdmin && (
              <div className="pt-6 border-t">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Edit Organization
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-2 border border-black/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Organization Slug
              </label>
              <p className="text-zinc-600 font-mono text-sm">
                {organization.slug}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Slug cannot be changed
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: organization.name });
                }}
                className="px-6 py-2 border border-black/8 rounded-lg hover:bg-zinc-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {isOwner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            Ownership Transfer
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            As the organization owner, you can transfer ownership to another
            member. This action cannot be undone.
          </p>
          <p className="text-xs text-yellow-700">
            Note: Ownership transfer functionality will be available in a future
            update.
          </p>
        </motion.div>
      )}
    </div>
  );
}

