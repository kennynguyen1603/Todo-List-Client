import { useRef, useEffect, useState } from "react";

const EditableInput = ({
  label,
  type,
  name,
  value,
  isEditing,
  onChange,
  accept,
}) => {
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState("auto");

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(`${inputRef.current.offsetWidth}px`);
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm mb-1 text-gray-400 ml-1">{label}</p>
      {isEditing ? (
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          accept={accept}
          className="text-sm border-[1px] border-gray-200 rounded-md p-2"
        />
      ) : (
        <p className="text-sm p-[9px]" style={{ width: inputWidth }}>
          {value}
        </p>
      )}
    </div>
  );
};

export default EditableInput;
