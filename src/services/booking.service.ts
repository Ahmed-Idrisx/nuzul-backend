import { env } from "../config/env.js";
import { transporter } from "../config/nodemailer.js";

interface sendBookingEmailProps {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  hotelAddress: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
}

export async function sendBookingEmail({
  bookingId,
  guestName,
  guestEmail,
  hotelName,
  hotelAddress,
  checkInDate,
  checkOutDate,
  totalPrice,
}: sendBookingEmailProps) {
  await transporter.sendMail({
    from: `"Nuzul" <${env.SMTP_FROM}>`,
    to: guestEmail,
    subject: "Hotel Booking Details",
    html: `
      <h2>Your Booking Details</h2>
        <p>Dear ${guestName},</p>
        <p>Thank you for your booking! And here are your booking details</p>
        <ul>
          <li><strong>Booking ID: </strong>${bookingId}</li>
          <li><strong>Hotel Name: </strong>${hotelName}</li>
          <li><strong>Location: </strong>${hotelAddress}</li>
          <li><strong>Date: </strong>From ${checkInDate.toDateString()} To ${checkOutDate.toDateString()}</li>
          <li><strong>Total Amount: </strong>$${totalPrice.toFixed(2)}</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us.</p>
    `,
  });
}
