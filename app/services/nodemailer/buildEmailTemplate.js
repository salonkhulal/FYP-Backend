// utils/buildEmailTemplate.js

function buildEmailTemplate(type, data) {
  switch (type) {
    case "verify":
      return {
        subject: "Your Smart Finder Verification Code",
        html: `
          <h2>Smart Finder Email Verification</h2>
          <p>Your verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            margin: 20px 0;
            padding: 10px 20px;
            display: inline-block;
            background: #f0f0f0;
            border-radius: 8px;
          ">
            ${data.code}
          </div>

          <p>This code will expire in <strong>2 minutes</strong>.</p>

          <p>If you did not request this, please ignore this message.</p>
        `,
      };

    case "reset":
  return {
    subject: "Reset Your Smart Finder Password",
    html: `
      <h2>Smart Finder Password Reset</h2>
      <p>You requested to reset your password.</p>

      <p>Click the link below to create a new password:</p>

      <a href="${data.resetUrl}" 
         style="
            display: inline-block;
            padding: 12px 20px;
            margin: 20px 0;
            background: #007bff;
            color: #ffffff;
            text-decoration: none;
            font-size: 18px;
            border-radius: 6px;
          ">
        Reset Password
      </a>

      <p>If the button doesn't work, copy and paste this link in your browser:</p>
      <p style="word-break: break-all;">
        ${data.resetUrl}
      </p>

      <p>This link will expire in <strong>15 minutes</strong>.</p>

      <p>If you did not request this, please ignore this message.</p>
    `,
  };

    case "lost-item":
      return {
        subject: "Someone Reported Your Lost Item!",
        html: `
          <h2>Good News!</h2>
          <p>A user claims to have found an item matching your lost item report.</p>
          <p><strong>Item:</strong> ${data.itemName}</p>
          <p>Open the app to chat and confirm.</p>
        `,
      };

    case "found-item":
      return {
        subject: "A User is Interested in Your Found Item Report",
        html: `
          <h2>Attention!</h2>
          <p>A user reported losing an item similar to one you found.</p>
          <p><strong>Item:</strong> ${data.itemName}</p>
          <p>Open Smart Finder to connect and verify.</p>
        `,
      };

    case "custom":
      return {
        subject: data.subject,
        html: data.html,
      };

    default:
      throw new Error("Unknown email type");
  }
}

export default buildEmailTemplate;
