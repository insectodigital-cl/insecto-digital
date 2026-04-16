export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const mensaje = formData.get("mensaje");

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: "TU-CORREO@gmail.com" }]
      }],
      from: { email: "hola@tudominio.com", name: "Wellgrid Web" },
      subject: `Nuevo contacto de ${nombre}`,
      content: [{
        type: "text/plain",
        value: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`
      }]
    })
  });

  if (response.ok) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}