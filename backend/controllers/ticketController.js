const PDFDocument = require("pdfkit");
const Booking = require("../models/Booking");

exports.getETicket = async (req, res) => {
  const bookingReference = req.params.bookingReference;

  console.log(
    `[1] Starting e-ticket generation for booking reference: ${bookingReference}`
  );

  try {
    const booking = await Booking.findOne({ bookingReference })
      .populate("event")
      .exec();

    if (!booking) {
      console.log(`[2] Booking not found for reference: ${bookingReference}`);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`[3] Booking found, creating PDF document`);

    // Create a PDF document
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    console.log(`[4] Setting response headers`);
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=e-ticket_${bookingReference}.pdf`
    );

    console.log(`[5] Piping PDF document to response`);
    // Pipe the PDF document to the response
    doc.pipe(res);

    console.log(`[6] Adding content to PDF`);
    try {
      // Add content to the PDF
      doc.fontSize(25).text("E-Ticket", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Booking Reference: ${bookingReference}`);
      doc.text(`Event: ${booking.event.name}`);
      doc.text(`Date: ${new Date(booking.event.date).toLocaleDateString()}`);
      doc.text(`Time: ${booking.event.time}`);
      doc.text(`Venue: ${booking.event.venue}`);
      doc.text(`Seats: ${booking.seats.join(", ")}`);

      // Add a border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

      console.log(`[7] Finalizing PDF document`);
      // Finalize the PDF and end the stream
      doc.end();

      console.log(
        `[8] E-ticket generated successfully for booking reference: ${bookingReference}`
      );
    } catch (pdfError) {
      console.error(`[ERROR] Error during PDF generation:`, pdfError);
      throw pdfError;
    }
  } catch (error) {
    console.error("[ERROR] Error in getETicket:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error generating e-ticket", error: error.message });
    } else {
      console.error(
        "[ERROR] Headers already sent, unable to send error response"
      );
    }
  } finally {
    console.log(`[9] getETicket function completed`);
  }
};
