import Image from "next/image";

type FillImageProps = {
  SCR_text: string;
  AlT_text: string;
  classNameDiv?: string;
  className?: string;
  Width_num: number;
  Height_num: number;
};

export default function FillImage({
  SCR_text,
  AlT_text,
  classNameDiv = "",
  className = "",
  Width_num,
  Height_num,
}: FillImageProps) {
  return (
    <div className={`md:hidden relative w-full flex h-20 ${classNameDiv}`}>
      <Image
        src={SCR_text}
        alt={AlT_text}
        width={Width_num}
        height={Height_num}
        className={className}
      />
    </div>
  );
}
