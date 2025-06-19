const crypto = require('crypto')

function customSerialize(value) {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return `[${value.map(customSerialize).join(', ')}]`
    } else {
      return `{${Object.entries(value).map(([k, v]) => `${k}: ${customSerialize(v)}`).join(', ')}}`
    }
  }
  return JSON.stringify(value)
}

function serializePayload(payload) {
  return Object.entries(payload).map(([k, v]) => `${k}:${customSerialize(v)}`).join(',')
}

function createSignature(secret, payload, timestamp) {
  const payloadStr = `timestamp:${timestamp},${serializePayload(payload)}`
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payloadStr)
  return hmac.digest('base64')
}

module.exports = {
  createSignature,
}
