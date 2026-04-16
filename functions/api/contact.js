// functions/api/contact.js
// Guarda este archivo en: functions/api/contact.js (dentro de tu repo)
// Cloudflare Pages lo despliega automáticamente en /api/contact

export async function onRequestPost({ request, env }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const data = await request.json();
    const { nombre, email, servicio, mensaje } = data;

    if (!nombre || !email || !mensaje) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers }
      );
    }

    // Envía el email usando Cloudflare Email Routing
    // hola@insectodigital.com → agenciainsectodigital@gmail.com
    await env.EMAIL.send({
      from: 'hola@insectodigital.com',
      to: 'agenciainsectodigital@gmail.com',
      subject: `✦ Nuevo contacto desde insectodigital.com — ${nombre}`,
      text: `
Nuevo mensaje recibido desde el formulario de insectodigital.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATOS DEL CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre:    ${nombre}
Email:     ${email}
Servicio:  ${servicio || 'No especificado'}

MENSAJE:
${mensaje}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responder directamente a: ${email}
      `.trim(),
      replyTo: email,
    });

    return new Response(JSON.stringify({ ok: true }), { headers });

  } catch (err) {
    console.error('Error al enviar email:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno al enviar' }),
      { status: 500, headers }
    );
  }
}

// Permite preflight CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
