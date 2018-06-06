export default function errorResponse (error, reason) {
  return {
    result: 'fail',
    success: false,
    ok: false,
    name: 'error',
    error: error,
    reason: reason
  }
}
