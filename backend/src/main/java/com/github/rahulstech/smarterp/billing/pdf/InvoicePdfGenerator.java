package com.github.rahulstech.smarterp.billing.pdf;

import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItemEntity;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * PDF generator for dynamically generating a professional sale invoice from voucher data.
 */
public class InvoicePdfGenerator {

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,##0.00");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static byte[] generateInvoice(
            CompanyEntity company,
            CustomerEntity customer,
            SaleVoucherEntity voucher,
            List<SaleVoucherItemEntity> items) {

        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font styles
            Font companyNameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.DARK_GRAY);

            // 1. Company Information Section
            Paragraph companyName = new Paragraph(company.getName(), companyNameFont);
            companyName.setSpacingAfter(4);
            document.add(companyName);

            Paragraph companyGst = new Paragraph("GSTIN: " + company.getGstNumber(), boldFont);
            companyGst.setSpacingAfter(4);
            document.add(companyGst);

            String fullAddress = company.getAddress() != null ? company.getAddress().buildFullAddress() : "";
            Paragraph companyAddress = new Paragraph(fullAddress, normalFont);
            companyAddress.setSpacingAfter(15);
            document.add(companyAddress);

            // Thin line separator
            LineSeparator line = new LineSeparator();
            line.setLineColor(new BaseColor(200, 200, 200));
            line.setLineWidth(1f);
            document.add(new Chunk(line));

            // Space after line
            Paragraph space = new Paragraph(" ");
            space.setSpacingAfter(10);
            document.add(space);

            // 2. Invoice Meta and Customer Section
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{50f, 50f});

            // Customer Name Left Side
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);
            customerCell.addElement(new Paragraph("Customer Name:", boldFont));
            customerCell.addElement(new Paragraph(customer.getName(), normalFont));
            metaTable.addCell(customerCell);

            // Invoice No and Date Right Side
            PdfPCell invoiceCell = new PdfPCell();
            invoiceCell.setBorder(Rectangle.NO_BORDER);
            invoiceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Paragraph invNoPara = new Paragraph();
            invNoPara.setAlignment(Element.ALIGN_RIGHT);
            invNoPara.add(new Chunk("Invoice No: ", boldFont));
            invNoPara.add(new Chunk(voucher.getVoucherNumber(), normalFont));
            invoiceCell.addElement(invNoPara);

            Paragraph invDatePara = new Paragraph();
            invDatePara.setAlignment(Element.ALIGN_RIGHT);
            invDatePara.add(new Chunk("Invoice Date: ", boldFont));
            invDatePara.add(new Chunk(voucher.getVoucherDate().format(DATE_FORMATTER), normalFont));
            invoiceCell.addElement(invDatePara);

            metaTable.addCell(invoiceCell);
            document.add(metaTable);

            // Space before items table
            Paragraph tableSpace = new Paragraph(" ");
            tableSpace.setSpacingAfter(15);
            document.add(tableSpace);

            // 3. Items Table Section
            PdfPTable itemsTable = new PdfPTable(5);
            itemsTable.setWidthPercentage(100);
            itemsTable.setWidths(new float[]{40f, 15f, 15f, 15f, 15f});

            // Table Headers
            String[] headers = {"Item Name", "HSN", "Quantity", "Rate", "Amount"};
            for (int i = 0; i < headers.length; i++) {
                PdfPCell headerCell = new PdfPCell(new Phrase(headers[i], boldFont));
                headerCell.setBackgroundColor(new BaseColor(245, 245, 245));
                headerCell.setPadding(6);
                headerCell.setBorderColor(new BaseColor(220, 220, 220));
                if (i >= 2) {
                    headerCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                } else {
                    headerCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                }
                itemsTable.addCell(headerCell);
            }

            // Table Rows
            for (SaleVoucherItemEntity item : items) {
                // Item Name
                PdfPCell nameCell = new PdfPCell(new Phrase(item.getItemName() != null ? item.getItemName() : "", normalFont));
                nameCell.setPadding(6);
                nameCell.setBorderColor(new BaseColor(220, 220, 220));
                itemsTable.addCell(nameCell);

                // HSN
                PdfPCell hsnCell = new PdfPCell(new Phrase(item.getHsnCode() != null ? item.getHsnCode() : "", normalFont));
                hsnCell.setPadding(6);
                hsnCell.setBorderColor(new BaseColor(220, 220, 220));
                itemsTable.addCell(hsnCell);

                // Quantity
                PdfPCell qtyCell = new PdfPCell(new Phrase(item.getQuantity() != null ? item.getQuantity().toString() : "0", normalFont));
                qtyCell.setPadding(6);
                qtyCell.setBorderColor(new BaseColor(220, 220, 220));
                qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                itemsTable.addCell(qtyCell);

                // Rate
                String rateVal = item.getRate() != null ? CURRENCY_FORMAT.format(item.getRate()) : "0.00";
                PdfPCell rateCell = new PdfPCell(new Phrase(rateVal, normalFont));
                rateCell.setPadding(6);
                rateCell.setBorderColor(new BaseColor(220, 220, 220));
                rateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                itemsTable.addCell(rateCell);

                // Amount
                String amtVal = item.getLineTotal() != null ? CURRENCY_FORMAT.format(item.getLineTotal()) : "0.00";
                PdfPCell amtCell = new PdfPCell(new Phrase(amtVal, normalFont));
                amtCell.setPadding(6);
                amtCell.setBorderColor(new BaseColor(220, 220, 220));
                amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                itemsTable.addCell(amtCell);
            }

            // Grand Total Row
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("Grand Total", boldFont));
            totalLabelCell.setColspan(4);
            totalLabelCell.setPadding(6);
            totalLabelCell.setBorderColor(new BaseColor(220, 220, 220));
            totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            itemsTable.addCell(totalLabelCell);

            String grandTotalVal = voucher.getGrandTotal() != null ? CURRENCY_FORMAT.format(voucher.getGrandTotal()) : "0.00";
            PdfPCell totalValueCell = new PdfPCell(new Phrase(grandTotalVal, boldFont));
            totalValueCell.setPadding(6);
            totalValueCell.setBorderColor(new BaseColor(220, 220, 220));
            totalValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            itemsTable.addCell(totalValueCell);

            document.add(itemsTable);

            // Space before footer section
            Paragraph footerSpace = new Paragraph(" ");
            footerSpace.setSpacingAfter(25);
            document.add(footerSpace);

            // 4. Terms and Signature Section
            PdfPTable footerTable = new PdfPTable(2);
            footerTable.setWidthPercentage(100);
            footerTable.setWidths(new float[]{60f, 40f});

            // Terms & Conditions Left Column
            PdfPCell termsCell = new PdfPCell();
            termsCell.setBorder(Rectangle.NO_BORDER);
            termsCell.addElement(new Paragraph("Terms & Conditions", boldFont));
            termsCell.addElement(new Paragraph("• Product not refundable", smallFont));
            termsCell.addElement(new Paragraph("• Replace within one week", smallFont));
            termsCell.addElement(new Paragraph("• Bring the bill for replacement", smallFont));
            footerTable.addCell(termsCell);

            // Authorized Signature Right Column
            PdfPCell signCell = new PdfPCell();
            signCell.setBorder(Rectangle.NO_BORDER);
            signCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            // Space to sign
            Paragraph signSpacing = new Paragraph(" ");
            signSpacing.setSpacingAfter(30);
            signCell.addElement(signSpacing);

            Paragraph authSign = new Paragraph("Authorized Signature", boldFont);
            authSign.setAlignment(Element.ALIGN_RIGHT);
            signCell.addElement(authSign);

            footerTable.addCell(signCell);
            document.add(footerTable);

        } catch (DocumentException e) {
            throw new RuntimeException("Failed to construct the PDF invoice layout", e);
        } finally {
            document.close();
        }

        return out.toByteArray();
    }
}
