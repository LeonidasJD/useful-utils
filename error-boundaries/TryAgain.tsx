import PageWrapper from "../layout/PageWrapper";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useNavigate } from "react-router-dom";
import { FaServer } from "react-icons/fa";

//**Try Again component is for specific component error boundaries   */
type TryAgainProps = {
  onTryAgain: () => void;
};

const TryAgain = ({ onTryAgain }: TryAgainProps) => {
  const navigate = useNavigate();
  const handleTryAgain = () => {
    onTryAgain();
  };
  const handleGoHome = () => {
    navigate("/");
  };
  return (
    <PageWrapper className="px-15 py-15 flex flex-col gap-5">
      <Text asChild variant="h2" className="text-center">
        <p>Ooops! Something went wrong on the server</p>
      </Text>
      <div className="flex items-center justify-center">
        <FaServer size={80} color="var(--color-pink-500)" />
      </div>
      <div className="flex flex-row gap-3 mt-6 items-center justify-center">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleTryAgain}
        >
          Try Again
        </Button>
        <Text asChild variant="textLarge">
          <p>OR</p>
        </Text>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleGoHome}
        >
          Go to home
        </Button>
      </div>
    </PageWrapper>
  );
};

export default TryAgain;
