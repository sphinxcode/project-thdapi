# n8n Integration with Bearer Token Auth

## Railway Environment Setup

1. **Set API Key in Railway:**
   - Go to Railway Dashboard → Your Service
   - Settings → Variables
   - Add: `API_KEY` = `your-secure-random-key-here`
   - Generate a secure key: `openssl rand -base64 32`

## cURL Test

```bash
# Replace with your Railway URL and API key
curl -X POST https://your-service.up.railway.app/api/human-design \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secure-random-key-here" \
  -d '{
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "birthLocation": "Manila, Philippines"
  }'
```

## n8n HTTP Request Node Configuration

### Method 1: Using HTTP Request Node

**Node Settings:**
- **Method:** POST
- **URL:** `https://your-service.up.railway.app/api/human-design`
- **Authentication:** Generic Credential Type
  - **Credential Type:** Header Auth
  - **Name:** `Authorization`
  - **Value:** `Bearer your-secure-random-key-here`

**OR using built-in Bearer token:**
- **Authentication:** Predefined Credential Type
  - **Credential Type:** HTTP Header Auth
  - **Header Auth Credentials:**
    - **Header Name:** `Authorization`
    - **Header Value:** `Bearer your-secure-random-key-here`

**Body:**
```json
{
  "birthDate": "{{ $json.birthDate }}",
  "birthTime": "{{ $json.birthTime }}",
  "birthLocation": "{{ $json.birthLocation }}"
}
```

### Method 2: Detailed Step-by-Step

1. **Add HTTP Request Node**
2. **Configure Request:**
   - Method: `POST`
   - URL: `https://your-service.up.railway.app/api/human-design`
   
3. **Set Authentication:**
   - Click "Add Auth" or "Authentication"
   - Select "Generic Credential Type"
   - Choose "Header Auth"
   
4. **Create Credential:**
   - Name: `Human Design API`
   - Header Name: `Authorization`
   - Header Value: `Bearer your-secure-random-key-here`
   - Save

5. **Set Body:**
   - Body Type: `JSON`
   - JSON:
   ```json
   {
     "birthDate": "{{ $json.birthDate }}",
     "birthTime": "{{ $json.birthTime }}",
     "birthLocation": "{{ $json.birthLocation }}",
     "latitude": "{{ $json.latitude }}",
     "longitude": "{{ $json.longitude }}"
   }
   ```

6. **Test:** Execute node

## Example n8n Workflow JSON

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "https://your-service.up.railway.app/api/human-design",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "birthDate",
              "value": "={{ $json.birthDate }}"
            },
            {
              "name": "birthTime",
              "value": "={{ $json.birthTime }}"
            },
            {
              "name": "birthLocation",
              "value": "={{ $json.birthLocation }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Human Design API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [820, 340],
      "credentials": {
        "httpHeaderAuth": {
          "id": "1",
          "name": "Human Design API Auth"
        }
      }
    }
  ],
  "connections": {}
}
```

## Security Best Practices

1. **Generate Strong API Key:**
   ```bash
   # On Mac/Linux
   openssl rand -base64 32
   
   # Or use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Store in Railway Environment Variables:**
   - Never commit API keys to git
   - Use Railway's environment variables
   - Different keys for production/staging

3. **Rotate Keys Regularly:**
   - Update `API_KEY` in Railway
   - Update in n8n credentials
   - Redeploy Railway service

## Error Responses

**401 Unauthorized (Missing token):**
```json
{
  "success": false,
  "error": "Unauthorized - Missing or invalid Authorization header",
  "message": "Please provide: Authorization: Bearer YOUR_API_KEY"
}
```

**403 Forbidden (Invalid token):**
```json
{
  "success": false,
  "error": "Forbidden - Invalid API key"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "type": { "name": "Generator" },
    "strategy": "To Respond",
    "authority": { "name": "Sacral" },
    "profile": { "number": "3/5" },
    "gates": [...]
  }
}
```

## Testing

**Health Check (No Auth Required):**
```bash
curl https://your-service.up.railway.app/health
```

**Calculate with Auth:**
```bash
curl -X POST https://your-service.up.railway.app/api/human-design \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"birthDate":"1990-05-15","birthTime":"14:30","birthLocation":"Manila"}'
```
