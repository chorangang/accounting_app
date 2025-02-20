import { Dispatch, SetStateAction } from 'react';

interface SelectDateProps {
  setDate: Dispatch<SetStateAction<string>>;
}

export function SelectDate ({ setDate }: SelectDateProps) {
  return (
    <>
      <h2 className='text-center my-4'>日付の選択</h2>
      <div className='flex justify-center mb-10'>
        <input
          type="date"
          className="nes-input w-full sm:w-1/2 mx-auto"
          onChange={(e) => setDate(e.target.value)}
          />
      </div>
    </>
  );
}