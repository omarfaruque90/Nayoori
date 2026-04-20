import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryArea: string;
  deliveryAddress: string;
  createdAt: string;
  invoiceUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderId,
  customerName,
  customerEmail,
  items,
  totalAmount,
  deliveryArea,
  deliveryAddress,
  createdAt,
  invoiceUrl,
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Html>
      <Head>
        <style>{`
          body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #8b6f47 0%, #a8896f 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
          }
          .logo-text {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            margin: 0;
          }
          .tagline {
            font-size: 12px;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-top: 5px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .info-section {
            background-color: #fdfbf7;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #d4a574;
          }
          .info-label {
            font-size: 12px;
            color: #8b6f47;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            color: #333333;
            font-weight: 500;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table th {
            background-color: #8b6f47;
            color: #ffffff;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
            color: #333333;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .total-row {
            background-color: #fdfbf7;
          }
          .total-row td {
            border: none;
            padding: 15px 12px;
            font-weight: 600;
            font-size: 16px;
          }
          .total-label {
            color: #8b6f47;
          }
          .total-amount {
            color: #8b6f47;
            font-size: 20px;
          }
          .delivery-section {
            background-color: #fdfbf7;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
          }
          .section-title {
            font-size: 14px;
            color: #8b6f47;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
          }
          .delivery-info {
            font-size: 14px;
            color: #333333;
            line-height: 1.6;
          }
          .cta-button {
            background-color: #8b6f47;
            color: #ffffff;
            padding: 14px 32px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
            margin: 30px 0;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #e0e0e0;
          }
          .footer-link {
            color: #8b6f47;
            text-decoration: none;
          }
          .divider {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 30px 0;
          }
        `}</style>
      </Head>
      <Preview>Order Confirmation - {orderId}</Preview>
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff' }}>
          {/* Header */}
          <Section style={{
            background: 'linear-gradient(135deg, #8b6f47 0%, #a8896f 100%)',
            padding: '40px 20px',
            textAlign: 'center' as const,
            color: '#ffffff',
          }}>
            <Text style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '2px', margin: '0' }}>
              NAYOORI
            </Text>
            <Text style={{ fontSize: '12px', letterSpacing: '1px', opacity: 0.9, marginTop: '5px', margin: '5px 0 0 0' }}>
              Luxury Fashion & Accessories
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '40px 30px' }}>
            <Text style={{ fontSize: '18px', color: '#333333', marginBottom: '20px', fontWeight: '600' }}>
              Thank you for your order, {customerName}!
            </Text>

            <Text style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', marginBottom: '20px' }}>
              We've received your payment and your order is being processed. You can track your order status below.
            </Text>

            {/* Order Info */}
            <Section style={{
              backgroundColor: '#fdfbf7',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              borderLeft: '4px solid #d4a574',
            }}>
              <Row style={{ marginBottom: '15px' }}>
                <Text style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px', margin: '0' }}>
                  Order ID
                </Text>
                <Text style={{ fontSize: '16px', color: '#333333', fontWeight: '500', margin: '0' }}>
                  {orderId}
                </Text>
              </Row>
              <Row>
                <Text style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px', margin: '0' }}>
                  Order Date
                </Text>
                <Text style={{ fontSize: '16px', color: '#333333', fontWeight: '500', margin: '0' }}>
                  {formattedDate}
                </Text>
              </Row>
            </Section>

            {/* Items Table */}
            <Section style={{ marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                margin: '30px 0',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#8b6f47' }}>
                    <th style={{
                      color: '#ffffff',
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      Product
                    </th>
                    <th style={{
                      color: '#ffffff',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      Qty
                    </th>
                    <th style={{
                      color: '#ffffff',
                      padding: '12px',
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      Price
                    </th>
                    <th style={{
                      color: '#ffffff',
                      padding: '12px',
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333333',
                      }}>
                        <div>{item.name}</div>
                        {item.color && <div style={{ fontSize: '12px', color: '#666666' }}>Color: {item.color}</div>}
                        {item.size && <div style={{ fontSize: '12px', color: '#666666' }}>Size: {item.size}</div>}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333333',
                        textAlign: 'center',
                      }}>
                        {item.quantity}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333333',
                        textAlign: 'right',
                      }}>
                        ৳{item.price.toFixed(2)}
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333333',
                        textAlign: 'right',
                        fontWeight: '600',
                      }}>
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#fdfbf7' }}>
                    <td colSpan={2} style={{
                      border: 'none',
                      padding: '15px 12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#8b6f47',
                      textAlign: 'right',
                    }}>
                      Total Amount:
                    </td>
                    <td colSpan={2} style={{
                      border: 'none',
                      padding: '15px 12px',
                      fontWeight: '600',
                      fontSize: '20px',
                      color: '#8b6f47',
                      textAlign: 'right',
                    }}>
                      ৳{totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Delivery Info */}
            <Section style={{
              backgroundColor: '#fdfbf7',
              padding: '20px',
              borderRadius: '8px',
              margin: '30px 0',
            }}>
              <Text style={{ fontSize: '14px', color: '#8b6f47', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px', margin: '0 0 15px 0' }}>
                Delivery Information
              </Text>
              <Text style={{ fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0' }}>
                <strong>Area:</strong> {deliveryArea}
                <br />
                <strong>Address:</strong> {deliveryAddress}
              </Text>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: 'center' as const, margin: '30px 0' }}>
              <Button
                href={`${baseUrl}/orders/${orderId}`}
                style={{
                  backgroundColor: '#8b6f47',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Track Your Order
              </Button>
            </Section>

            {/* Invoice Download */}
            {invoiceUrl && (
              <Section style={{ textAlign: 'center' as const, margin: '30px 0' }}>
                <Text style={{ fontSize: '12px', color: '#666666', marginBottom: '10px', margin: '0 0 10px 0' }}>
                  Your invoice is ready for download:
                </Text>
                <Button
                  href={invoiceUrl}
                  style={{
                    backgroundColor: '#d4a574',
                    color: '#333333',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Download Invoice (PDF)
                </Button>
              </Section>
            )}

            <Hr style={{ borderColor: '#e0e0e0', margin: '30px 0' }} />

            {/* Support */}
            <Text style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', marginBottom: '20px' }}>
              If you have any questions about your order, please don't hesitate to reach out to our customer support team.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{
            backgroundColor: '#f5f5f5',
            padding: '30px',
            textAlign: 'center' as const,
            fontSize: '12px',
            color: '#666666',
            borderTop: '1px solid #e0e0e0',
          }}>
            <Text style={{ margin: '0 0 10px 0' }}>
              © 2026 Nayoori. All rights reserved.
            </Text>
            <Text style={{ margin: '0' }}>
              <Link href={`${baseUrl}`} style={{ color: '#8b6f47', textDecoration: 'none' }}>
                Visit our store
              </Link>
              {' '} | {' '}
              <Link href={`${baseUrl}/contact`} style={{ color: '#8b6f47', textDecoration: 'none' }}>
                Contact us
              </Link>
            </Text>
            <Text style={{ margin: '15px 0 0 0', fontSize: '11px', color: '#999999' }}>
              Order Confirmation Email | {customerEmail}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
