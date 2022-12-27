const http = require('https')

exports.sendOTP = (smsOptions) => {
  return new Promise((resolve, reject) => {
    const data = {
      otp: smsOptions.otp,
      template_id: process.env.OTP_TEMPLATE_ID,
      mobile: '91' + smsOptions.phone,
      authkey: process.env.OTP_AUTH_KEY
    }
    const options = {
      method: 'GET',
      hostname: 'api.msg91.com',
      port: null,
      path: `/api/v5/otp?template_id=${process.env.OTP_TEMPLATE_ID}&mobile=${data.mobile}&authkey=${data.authkey}&otp=${data.otp}`,
      headers: {
        'content-type': 'application/json'
      }
    }
    const req = http.request(options, function (res) {
      const chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        const body = Buffer.concat(chunks).toString()
        console.log(body)

        if (JSON.parse(body).type === 'error') {
          resolve(false)
        }

        resolve(true)
      })
    })

    req.end()
  })
}
exports.verifyOTP = (smsOptions) => {
  return new Promise((resolve, reject) => {
    const data = {
      otp: smsOptions.otp,
      template_id: process.env.OTP_TEMPLATE_ID,
      mobile: '91' + smsOptions.phone,
      authkey: process.env.OTP_AUTH_KEY
    }

    const options = {
      method: 'GET',
      hostname: 'api.msg91.com',
      port: null,
      path: `/api/v5/otp/verify?otp=${data.otp}&authkey=${process.env.OTP_AUTH_KEY}&mobile=${data.mobile}`,
      headers: {
        'Content-Type': 'application/JSON'
      }
    }

    const req = http.request(options, function (res) {
      const chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        const body = Buffer.concat(chunks)
        console.log(body.toString())
        if (JSON.parse(body).type === 'error') {
          resolve(false)
        }

        resolve(true)
      })
    })

    req.end()
  })
}
