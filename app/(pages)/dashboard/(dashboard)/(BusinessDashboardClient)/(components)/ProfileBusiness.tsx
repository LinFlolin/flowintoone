import React from 'react'

export default function ProfileBusiness( { profile }: any) {
  return (
    <div>
        <pre className="text-xs">{JSON.stringify(profile, null, 2)}
        </pre>
    </div>
  )
}
