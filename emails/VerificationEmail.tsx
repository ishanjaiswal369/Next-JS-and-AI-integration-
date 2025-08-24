import * as React from 'react';

type VerificationEmailProps = {
  username: string;
  otp: string;
};

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '24px', background: '#f9f9f9' }}>
    <h2>Welcome, {username}!</h2>
    <p>
      Thank you for signing up. Please use the verification code below to complete your registration:
    </p>
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      letterSpacing: '4px',
      background: '#e6f7ff',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      margin: '24px 0'
    }}>
      {otp}
    </div>
    <p>
      If you did not request this, please ignore this email.
    </p>
    <p>
      Best regards,<br />
      The Team
    </p>
  </div>
);