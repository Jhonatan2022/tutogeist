import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DESTINO_EMAIL = "floritozzzz@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-student-id, x-ficha-id",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      studentName,
      fichaCodigo,
      fichaNombre,
      instructorName,
      mensaje,
      studentEmail,
      studentId,
      fichaId,
    } = await req.json();

    if (!studentName || !fichaCodigo || !mensaje) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const asunto = `Estudiante ${studentName} - Ficha ${fichaCodigo}`;

    const cuerpoHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #4c4eb3, #2dabb9); padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">TutorGeist</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Solicitud de contacto con instructor</p>
        </div>
        <div style="background: #f7f6ff; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <h2 style="color: #2d2d4e; margin: 0 0 16px;">Detalles</h2>
          <p><strong>Estudiante:</strong> ${studentName}</p>
          <p><strong>Correo estudiante:</strong> ${studentEmail || "No disponible"}</p>
          <p><strong>Ficha:</strong> ${fichaCodigo} — ${fichaNombre || ""}</p>
          <p><strong>Instructor:</strong> ${instructorName}</p>
        </div>
        <div style="background: #f7f6ff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #2d2d4e; margin: 0 0 12px;">Mensaje del estudiante</h2>
          <p style="border-left: 3px solid #4c4eb3; padding-left: 16px; color: #374151;">
            ${mensaje}
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 0.8rem; text-align: center; margin-top: 24px;">
          Enviado automáticamente desde TutorGeist
        </p>
      </div>
    `;

    // Enviar con Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!resendKey) {
      console.log("Sin RESEND_API_KEY — email simulado:", { to: DESTINO_EMAIL, asunto });
      return new Response(
        JSON.stringify({ success: true, message: "Simulado (sin API key)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TutorGeist <onboarding@resend.dev>",
        to: [DESTINO_EMAIL],
        subject: asunto,
        html: cuerpoHtml,
        reply_to: studentEmail,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      throw new Error(`Resend error: ${err}`);
    }

    // Guardar solicitud en BD
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (studentId && fichaId && supabaseUrl && serviceRole) {
      await fetch(`${supabaseUrl}/rest/v1/solicitudes`, {
        method: "POST",
        headers: {
          "apikey": serviceRole,
          "Authorization": `Bearer ${serviceRole}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          estudiante_id: studentId,
          ficha_id: fichaId,
          estado: "pending",
          mensaje,
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Correo enviado correctamente" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});