import { NextResponse } from 'next/server'

export async function POST(request) {
  const formData = await request.formData()

  const images = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('images[')) {
      images.push(value)
    }
  }

  if (images.length === 0) {
    return NextResponse.json(
      { error: 'No images provided' },
      { status: 400 }
    )
  }

  const taskId = 1234567890;

  return NextResponse.json(
    {
      status: 'PENDING',
      task_id: taskId,
    },
    { status: 202 }
  )
}
