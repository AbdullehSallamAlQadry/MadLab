import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { id } = params

  const wait = new URL(req.url).searchParams.get('wait')

  if (wait) {
    await new Promise(r => setTimeout(r, 500))
  }

  return NextResponse.json({
    "status": "COMPLETED",
    "task_id": id,
    "results": [
      {
        "id": 10,
        "result": "melanoma",
        "confidence": 0.91,
        "images": "http://localhost:3000/uploads/img2.jpg",
      },
      {
        "id": 10,
        "result": "melanoma",
        "confidence": 0.91,
        "images": "http://localhost:3000/uploads/img2.jpg"
      },
    ]
  })
}
