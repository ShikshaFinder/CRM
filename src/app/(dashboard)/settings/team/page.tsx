"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: number;
  invitedBy: {
    email: string;
    profile: {
      fullName: string | null;
    } | null;
  };
}

interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  user: {
    email: string;
    profile: {
      fullName: string | null;
    } | null;
  };
}

export default function TeamPage() {
  const { data: session } = useSession();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [inviteLoading, setInviteLoading] = useState(false);

  const organizationId = session?.user?.currentOrganizationId;

  useEffect(() => {
    if (organizationId) {
      fetchTeamData();
    }
  }, [organizationId]);

  const fetchTeamData = async () => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const [invitesRes, membersRes] = await Promise.all([
        fetch(`/api/organizations/invites?organizationId=${organizationId}`),
        fetch(`/api/organizations/members?organizationId=${organizationId}`),
      ]);

      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvites(invitesData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData);
      }
    } catch (err) {
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    setInviteLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/organizations/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send invitation");
        setInviteLoading(false);
        return;
      }

      setInviteEmail("");
      setInviteRole("MEMBER");
      setShowInviteForm(false);
      fetchTeamData();
    } catch (err) {
      setError("Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) return;

    try {
      const response = await fetch(`/api/organizations/invites/${inviteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTeamData();
      }
    } catch (err) {
      setError("Failed to cancel invitation");
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/organizations/invites/${inviteId}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Invitation resent successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend invitation");
      }
    } catch (err) {
      setError("Failed to resend invitation");
    }
  };

  const isAdmin =
    session?.user?.currentOrganizationRole === "ADMIN" ||
    session?.user?.currentOrganizationRole === "OWNER";

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Team Management</h1>
        <p className="text-zinc-600">Manage your organization members and invitations</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="mb-6">
          {!showInviteForm ? (
            <button
              onClick={() => setShowInviteForm(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Invite Member
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-black/8 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Send Invitation</h2>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-black/8 rounded-lg"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "MEMBER")}
                    className="w-full px-4 py-2 border border-black/8 rounded-lg"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {inviteLoading ? "Sending..." : "Send Invitation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteEmail("");
                    }}
                    className="px-4 py-2 border border-black/8 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <div className="bg-white border border-black/8 rounded-lg divide-y">
            {members.length === 0 ? (
              <div className="p-4 text-zinc-500 text-center">No members yet</div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {member.user.profile?.fullName || member.user.email}
                      </p>
                      <p className="text-sm text-zinc-500">{member.user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-zinc-100 rounded">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
          <div className="bg-white border border-black/8 rounded-lg divide-y">
            {invites.length === 0 ? (
              <div className="p-4 text-zinc-500 text-center">No pending invitations</div>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-zinc-500">
                        Invited by {invite.invitedBy.profile?.fullName || invite.invitedBy.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-zinc-100 rounded">
                        {invite.role}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResendInvite(invite.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => handleCancelInvite(invite.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

