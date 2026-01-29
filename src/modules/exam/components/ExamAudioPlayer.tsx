
interface Props {
  src: string;
}

export const ExamAudioPlayer = ({ src }: Props) => {
  return (
    <div className="sticky top-0 z-50 bg-white-97 shadow-md p-4 mb-4 border-b border-white-90">
      <div className="container mx-auto flex items-center gap-4">
        <span className="font-semibold text-gray-15">Listening Audio:</span>
        <audio controls className="w-full max-w-md" src={src} controlsList="nodownload">
            Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};
