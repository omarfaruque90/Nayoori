import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from '@react-pdf/renderer';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryArea: string;
  deliveryAddress: string;
  createdAt: string;
  transactionId?: string;
}

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#8b6f47',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b6f47',
    marginBottom: 5,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 10,
    color: '#a8896f',
    letterSpacing: 1,
  },
  invoiceNumber: {
    marginTop: 10,
    fontSize: 11,
    color: '#333333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b6f47',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row' as const,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#666666',
    width: '30%',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#333333',
    flex: 1,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: '#8b6f47',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontWeight: 'bold',
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8b6f47',
  },
  tableRow: {
    flexDirection: 'row' as const,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 10,
  },
  tableRowAlternate: {
    backgroundColor: '#fdfbf7',
  },
  tableCell: {
    flex: 1,
    color: '#333333',
  },
  tableCellLeft: {
    flex: 3,
    color: '#333333',
  },
  tableCellCenter: {
    flex: 1,
    textAlign: 'center' as const,
    color: '#333333',
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right' as const,
    color: '#333333',
  },
  totalSection: {
    flexDirection: 'row' as const,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#8b6f47',
  },
  totalLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8b6f47',
    textAlign: 'right' as const,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b6f47',
    textAlign: 'right' as const,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    fontSize: 9,
    color: '#666666',
    textAlign: 'center' as const,
  },
  footerText: {
    marginBottom: 5,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 9,
    color: '#666666',
  },
  badge: {
    backgroundColor: '#d4a574',
    color: '#333333',
    padding: '4 8',
    borderRadius: 3,
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 5,
    width: 'auto',
  },
});

/**
 * Invoice PDF Component
 */
export const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>NAYOORI</Text>
          <Text style={styles.tagline}>Luxury Fashion & Accessories</Text>
          <Text style={styles.invoiceNumber}>Invoice #{data.orderId}</Text>
        </View>

        {/* Invoice Info Row */}
        <View style={{ flexDirection: 'row' as const, marginBottom: 30 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice #</Text>
              <Text style={styles.value}>{data.orderId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
            {data.transactionId && (
              <View style={styles.row}>
                <Text style={styles.label}>Transaction ID</Text>
                <Text style={styles.value}>{data.transactionId}</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{data.customerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{data.customerEmail}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{data.customerPhone}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Area</Text>
            <Text style={styles.value}>{data.deliveryArea}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{data.deliveryAddress}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellLeft}>Product</Text>
            <Text style={styles.tableCellCenter}>Qty</Text>
            <Text style={styles.tableCellRight}>Unit Price</Text>
            <Text style={styles.tableCellRight}>Total</Text>
          </View>

          {data.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowAlternate : {},
              ]}
            >
              <View style={styles.tableCellLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={{ marginTop: 3 }}>
                  {item.color && (
                    <Text style={styles.itemDetails}>Color: {item.color}</Text>
                  )}
                  {item.size && (
                    <Text style={styles.itemDetails}>Size: {item.size}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.tableCellCenter}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>৳{item.price.toFixed(2)}</Text>
              <Text style={styles.tableCellRight}>
                ৳{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
          <Text style={styles.totalAmount}>৳{data.totalAmount.toFixed(2)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your purchase! Please keep this invoice for your records.
          </Text>
          <Text style={styles.footerText}>
            For inquiries, contact us at support@nayoori.com
          </Text>
          <Text style={styles.footerText}>© 2026 Nayoori. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
