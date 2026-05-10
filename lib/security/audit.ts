import prisma from "@/lib/prisma";

type AuditAction = "AUTH_LOGIN" | "AUTH_SIGNUP" | "TRIP_CREATE" | "TRIP_DELETE" | "ADMIN_ACCESS";

export async function logAuditEvent(
  userId: string,
  action: AuditAction,
  details: string,
  ip?: string
) {
  try {
    // In a production app, we'd have an AuditLog model in schema.prisma
    // For this hackathon, we'll log to console and potentially a generic Analytics model if it exists
    console.log(`[AUDIT] [${new Date().toISOString()}] User: ${userId} | Action: ${action} | Details: ${details} | IP: ${ip || 'unknown'}`);
    
    /*
    await prisma.auditLog.create({
      data: { userId, action, details, ip }
    });
    */
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
}
