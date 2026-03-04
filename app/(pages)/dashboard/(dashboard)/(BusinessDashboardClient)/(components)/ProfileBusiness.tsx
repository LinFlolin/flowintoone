import Image from "next/image";

export default function ProfileBusiness( { profile }: any) {
  const avatarSrc = profile?.avatar_url ?? "/images/default-avatar.png";

  return (
    <div>
        <div className="w-full h-full flex flex-col items-start justify-start gap-6">
          <Image src={avatarSrc} alt="upload" width={100} height={100} />
        </div>
    </div>
  )
}
