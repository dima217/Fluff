import { WheelItemData } from "@/components/AnimatedWheelPicker";
import { DateWheelItem } from "..";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function useDayPickerData(size: number) {
  const rawData: WheelItemData<string>[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const todayDateNumber = currentDate.getDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  let initialIndex = 0;

  for (let dateNumber = 1; dateNumber <= daysInMonth; dateNumber++) {
    const date = new Date(currentYear, currentMonth, dateNumber);

    const isTodayFlag = dateNumber === todayDateNumber;
    const isMarkedFlag = dateNumber === 1 || dateNumber === 28;

    if (isTodayFlag) {
      initialIndex = todayDateNumber;
    }

    rawData.push({
      key: `date-${dateNumber}`,
      value: dateNumber.toString(),
      content: <DateWheelItem />,
      dataForContent: {
        date: date,
        dayOfMonth: dateNumber,
        data: {
          isMarked: isMarkedFlag,
          isToday: isTodayFlag,
        },
      },
    });
  }

  const preparedData = rawData.map((item) => ({
    ...item,
    content: (
      <DateWheelItem
        size={size}
        date={item.dataForContent.date}
        data={item.dataForContent.data}
      />
    ),
  }));

  return {
    data: preparedData,
    initialIndex: initialIndex,
  };
}
