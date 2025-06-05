# Mahamaya Matrix Backend System

**Epic 1, Story E1_F2_S1: Backend System for Mahamaya Matrix**

This subsystem provides the backend infrastructure for the Mahamaya Matrix, a comprehensive system for storing and managing user context data derived from six Mahamaya Ground layers and the synthesized Archetypal Quintessence.

## Overview

The Mahamaya Matrix is the foundational data layer for the Nara Mode application, providing secure storage and management of archetypal user data including:

1. **Birthdate Encoding Data** - Encrypted birth information and numerological profiles
2. **Astrological Chart Data** - Natal, progressed, and transit charts
3. **Jungian Archetype Assessment Results** - Personality types and individuation data
4. **Gene Keys Profile Data** - Gene Keys activation sequences and contemplations
5. **Human Design Profile Data** - Type, strategy, authority, and profile information
6. **I Ching Hexagram Data** - Hexagrams related to user context
7. **Archetypal Quintessence Data** - Synthesized archetypal essence from all layers

## Architecture

### Directory Structure

```
subsystems/4_nara/
├── 2_services/
│   ├── mahamaya-matrix.service.mjs    # Core Mahamaya Matrix service
│   └── auth.service.mjs               # Enhanced authentication service
├── 3_models/
│   └── mahamaya-schemas.md            # MongoDB schema documentation
├── 4_controllers/
│   ├── mahamaya-matrix.controller.mjs # API controllers for Mahamaya Matrix
│   └── auth.controller.mjs            # Authentication controllers
├── 5_integration/
│   └── mahamaya-routes.mjs            # API routes and middleware
├── docs/
│   └── mahamaya-api-spec.yaml         # OpenAPI/Swagger specification
└── README.md                          # This file
```

### Technology Stack

- **Runtime**: Node.js (ESM modules)
- **Database**: MongoDB with field-level encryption
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Style**: RESTful with comprehensive error handling
- **Security**: AES-256-GCM encryption for PII data

## Features

### Security Features

- **Field-Level Encryption**: Sensitive PII data encrypted using AES-256-GCM
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Session Management**: Secure session tracking with automatic expiration
- **Data Isolation**: User data strictly isolated by userId
- **Soft Deletes**: Data preservation with deactivation options

### API Features

- **CRUD Operations**: Complete Create, Read, Update, Delete operations
- **Layer-Specific Access**: Individual access to each Mahamaya Ground layer
- **Completion Tracking**: Progress tracking across all layers
- **Comprehensive Validation**: Input validation and error handling
- **API Documentation**: OpenAPI/Swagger specification included

## Installation & Setup

### Prerequisites

- Node.js 18+ with ESM support
- MongoDB 5.0+
- Environment variables configured

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/epi-logos

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Encryption
MAHAMAYA_ENCRYPTION_KEY=your-32-byte-encryption-key

# Server
NODE_ENV=development
PORT=3001
```

### Installation

1. **Install Dependencies**
   ```bash
   cd epii_app/friendly-file-backend
   npm install bcrypt jsonwebtoken
   ```

2. **Initialize Services**
   ```javascript
   import { initializeRoutes } from './subsystems/4_nara/5_integration/mahamaya-routes.mjs';
   
   // Initialize Mahamaya Matrix routes
   await initializeRoutes();
   ```

3. **Add Routes to Express App**
   ```javascript
   import { mahamayaRoutes } from './subsystems/4_nara/5_integration/mahamaya-routes.mjs';
   
   app.use('/api', mahamayaRoutes);
   ```

## API Usage

### Authentication

#### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "securePassword123"
  }'
```

### Mahamaya Matrix Operations

#### Store Birthdate Encoding
```bash
curl -X POST http://localhost:3001/api/mahamaya/birthdate-encoding \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-01-01",
    "birthTime": "12:00:00",
    "birthLocation": {
      "city": "New York",
      "country": "USA",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "numerologicalProfile": {
      "lifePathNumber": 5,
      "destinyNumber": 8
    }
  }'
```

#### Get Complete Matrix
```bash
curl -X GET http://localhost:3001/api/mahamaya/matrix \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Specific Layer
```bash
curl -X GET http://localhost:3001/api/mahamaya/layer/birthdate-encoding \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Data Models

### User Profile
Central profile linking to all Mahamaya Ground layers with completion tracking.

### Birthdate Encoding
Encrypted birth information with numerological calculations.

### Astrological Charts
Natal, progressed, and transit chart data with planetary positions and aspects.

### Jungian Assessments
Personality type assessments with archetype profiles and individuation tracking.

### Gene Keys Profile
Gene Keys activation sequences with contemplations and insights.

### Human Design Profile
Type, strategy, authority, and profile information with centers and channels.

### I Ching Hexagrams
Hexagram data related to user context with interpretations.

### Archetypal Quintessence
Synthesized archetypal essence derived from all layers.

## Security Considerations

### Data Encryption
- **PII Fields**: Birth date, time, and location are encrypted at rest
- **Encryption Method**: AES-256-GCM with unique IVs and auth tags
- **Key Management**: Encryption keys stored securely in environment variables

### Authentication Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **Token Security**: JWT with secure secrets and appropriate expiration
- **Session Management**: Refresh tokens with automatic cleanup
- **Access Control**: Route-level authentication middleware

### Data Privacy
- **User Isolation**: All data strictly isolated by userId
- **Soft Deletes**: Data preservation with deactivation options
- **Audit Trails**: Creation and modification timestamps
- **GDPR Compliance**: Hard delete options for data removal

## Testing

### Unit Tests
```bash
npm test -- --grep "Mahamaya Matrix"
```

### Integration Tests
```bash
npm run test:integration -- --grep "Mahamaya API"
```

### API Testing
Use the included Swagger specification for API testing:
- Import `docs/mahamaya-api-spec.yaml` into Postman or Insomnia
- Use the `/api/docs` endpoint for interactive documentation

## Performance Optimization

### Database Indexes
- Primary indexes on `userId` for all collections
- Composite indexes for common query patterns
- TTL indexes for session cleanup
- Unique constraints for data integrity

### Caching Strategy
- Service-level caching for frequently accessed data
- Session caching for authentication
- Query result caching for complex aggregations

### Monitoring
- Performance metrics for API endpoints
- Database query performance monitoring
- Error tracking and alerting
- User activity analytics

## Integration with BPMCP

The Mahamaya Matrix integrates with the BPMCP (Bimba-Pratibimba Memory Coordination Protocol) system:

- **Tool Access**: BPMCP can access Mahamaya data via service methods
- **Agent Integration**: Nara Agent Core consumes Mahamaya data for personalization
- **Workflow Integration**: Mahamaya data feeds into BPMCP workflows

## Future Enhancements

### Planned Features
- **Real-time Synchronization**: Live updates across connected clients
- **Advanced Analytics**: Pattern recognition across user data
- **Export/Import**: Data portability and backup features
- **API Versioning**: Support for multiple API versions
- **GraphQL Support**: Alternative query interface

### Scalability Improvements
- **Horizontal Scaling**: Multi-instance deployment support
- **Database Sharding**: User data distribution strategies
- **Caching Layer**: Redis integration for performance
- **CDN Integration**: Static asset optimization

## Support

For technical support or questions about the Mahamaya Matrix system:

- **Documentation**: See `docs/mahamaya-api-spec.yaml` for complete API reference
- **Schema Reference**: See `3_models/mahamaya-schemas.md` for data models
- **Development Team**: Contact the Epi-Logos development team
- **Issue Tracking**: Use the project's issue tracking system

## License

This software is proprietary to Epi-Logos. All rights reserved.
