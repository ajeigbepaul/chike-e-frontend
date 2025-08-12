# Request Quote Feature

## Overview
The Request Quote feature allows customers to request custom pricing for products directly from the product detail page. This is particularly useful for B2B customers or bulk orders where standard pricing may not apply.

## Features Implemented

### Frontend Components

1. **RequestQuoteDialog Component** (`components/RequestQuoteDialog.tsx`)
   - Modal dialog form for quote requests
   - Captures customer information, quantity, and requirements
   - Form validation with React Hook Form
   - Integration with API for submission

2. **ProductInfo Component** (Updated)
   - Integrated the Request Quote button with the dialog
   - Maintains existing product display functionality

3. **Admin Quotes Page** (`app/admin/quotes/page.tsx`)
   - Admin interface to view and manage quote requests
   - Status management (pending, responded, accepted, rejected)
   - Pagination for large numbers of requests
   - Response functionality

### API Services

**Quote API Service** (`services/api/quote.ts`)
- `submitQuoteRequest()` - Submit a new quote request
- `getQuoteRequests()` - Fetch quote requests with pagination
- `getQuoteRequest()` - Get a specific quote request
- `updateQuoteStatus()` - Update quote status and send responses

### Data Types

**QuoteRequest Interface:**
```typescript
{
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  message?: string;
  expectedPrice?: number;
  urgency: 'low' | 'medium' | 'high';
}
```

**QuoteResponse Interface:**
```typescript
{
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  message?: string;
  expectedPrice?: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

## User Flow

### Customer Flow
1. Customer visits product detail page (`/product/[id]`)
2. Clicks "Request a quote" button
3. Fills out quote request form with:
   - Quantity needed
   - Contact information
   - Optional company details
   - Expected price (optional)
   - Urgency level
   - Additional message/requirements
4. Submits the request
5. Receives confirmation message

### Admin Flow
1. Admin accesses quotes management page (`/admin/quotes`)
2. Views list of all quote requests with status and priority
3. Can filter and paginate through requests
4. For pending requests, can:
   - Send a detailed response to customer
   - Accept the request
   - Reject the request
5. Status updates are tracked and displayed

## API Endpoints Required

The frontend expects these backend endpoints to be implemented:

- `POST /api/v1/quotes` - Create new quote request
- `GET /api/v1/quotes` - Get quote requests (with pagination)
- `GET /api/v1/quotes/:id` - Get specific quote request
- `PATCH /api/v1/quotes/:id` - Update quote status

## Implementation Notes

### Form Validation
- Email validation using regex pattern
- Required fields: quantity, customer name, email
- Minimum quantity validation
- Optional fields handled gracefully

### Status Management
- **Pending**: Initial state when quote is submitted
- **Responded**: Admin has sent a response to customer
- **Accepted**: Quote has been accepted
- **Rejected**: Quote has been rejected

### UI/UX Features
- Responsive design for mobile and desktop
- Loading states for API calls
- Error handling with user-friendly messages
- Success notifications using react-hot-toast
- Product information display in quote form
- Color-coded status badges
- Urgency level indicators

### Security Considerations
- Form data is validated on both client and server
- Authentication required for admin functions
- Input sanitization to prevent XSS
- Rate limiting recommended for quote submissions

## Usage

### For Customers
The "Request a quote" button is automatically available on all product pages. No additional configuration needed.

### For Administrators
Access the quotes management interface at `/admin/quotes` after logging in with admin credentials.

### Integration with Existing Systems
The feature integrates seamlessly with the existing:
- Product management system
- User authentication
- Admin dashboard
- Notification system (toast messages)

## Future Enhancements

Potential improvements that could be added:
- Email notifications to customers and admins
- Quote expiry dates
- Bulk quote requests for multiple products
- Quote templates for common requests
- Integration with CRM systems
- Quote history tracking
- Automated responses based on rules
- File attachments for specifications
- Quote comparison features
- Export functionality for admin reports

## Dependencies

The feature uses these existing project dependencies:
- React Hook Form for form management
- TanStack Query for API state management
- Radix UI for dialog components
- React Hot Toast for notifications
- Tailwind CSS for styling

No additional dependencies were added to implement this feature.
