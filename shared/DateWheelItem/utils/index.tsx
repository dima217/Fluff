import type { TrackingCalendar } from "@/api/types";
import { WheelItemData } from "@/shared/AnimatedWheelPicker";
import { DateWheelItem } from "..";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function formatDateAsKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayStatus(
  totalCalories: number,
  dailyGoal: number
): "cheatMeal" | "notTracked" | "strongExcess" | "insufficientIntake" | null {
  if (totalCalories === 0) return "notTracked";
  if (totalCalories > dailyGoal * 1.2) return "strongExcess";
  if (totalCalories < dailyGoal * 0.8) return "insufficientIntake";
  if (totalCalories > dailyGoal) return "cheatMeal";
  return null;
}

export function useDayPickerData(
  size: number,
  calendar?: TrackingCalendar,
  dailyGoal: number = 2137,
  selectedDateIndex?: number
) {
  const rawData: WheelItemData<string>[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const todayDateNumber = currentDate.getDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  let initialIndex = 0;

  for (let dateNumber = 1; dateNumber <= daysInMonth; dateNumber++) {
    const date = new Date(currentYear, currentMonth, dateNumber);
    const dateKey = formatDateAsKey(date);
    const dayData = calendar?.[dateKey];

    const isTodayFlag = dateNumber === todayDateNumber;
    const isSelectedFlag =
      selectedDateIndex !== undefined && dateNumber === selectedDateIndex + 1;
    const totalCalories = dayData?.totalCalories || 0;
    const dayStatus = getDayStatus(totalCalories, dailyGoal);

    if (isTodayFlag) {
      initialIndex = todayDateNumber - 1; // 0-based index
    }

    rawData.push({
      key: `date-${dateNumber}`,
      value: dateNumber.toString(),
      content: <DateWheelItem />,
      dataForContent: {
        date: date,
        dayOfMonth: dateNumber,
        data: {
          isToday: isTodayFlag,
          isSelected: isSelectedFlag,
          dayStatus: dayStatus,
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
