import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ButtonProps = {
  className: string;
  opaque: boolean;
  title: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
};

function Button({ title, className, opaque, onClick }: ButtonProps) {

  const baseStyle = 'inline-flex items-center border border-transparent font-medium rounded-md focus:outline-none transition ease-in-out duration-150'

  if (opaque) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseStyle} ${className}`}
      >
        { title }
      </button>
    )
  }
  return (
    <span className="inline-flex round-md shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className={`${baseStyle} ${className}`}
      >
        { title }
      </button>
    </span>
  )
}

export default Button;