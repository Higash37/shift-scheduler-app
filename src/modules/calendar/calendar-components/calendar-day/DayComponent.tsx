import React, { memo, useMemo } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { colors } from "@/common/common-theme/ThemeColors";
import { DayComponentProps } from "../../calendar-types/common.types";
import { getDayColor } from "../../calendar-utils/calendar.utils";
import { useResponsiveCalendarSize } from "../../calendar-constants/constants";

/**
 * カレンダーの日付コンポーネント
 * メモ化して不要な再レンダリングを防止
 */
export const DayComponent = memo<{
  date?: DayComponentProps["date"];
  state?: DayComponentProps["state"];
  marking?: DayComponentProps["marking"];
  onPress: (dateString: string) => void;
}>(({ date, state, marking, onPress }) => {
  // レスポンシブサイズの取得
  const { dayWidth, dayHeight, isSmallScreen } = useResponsiveCalendarSize(); // スタイルの動的生成
  const dynamicStyles = useMemo(() => {
    return {
      dayContainer: {
        width: dayWidth,
        height: dayHeight,
        padding: 0, // パディングを0に設定して余白をなくす
      },
      selectedDay: {
        borderRadius: Math.min(dayWidth, dayHeight) / 2,
      },
      dayText: {
        fontSize: isSmallScreen ? 16 : 14, // フォントサイズをさらに小さく
        letterSpacing: -1.0, // 文字間隔を狭める
      },
    };
  }, [dayWidth, dayHeight, isSmallScreen]);

  // 選択中の日付かどうか
  const isSelected = marking?.selected;
  // 今日の日付かどうか
  const isToday = state === "today";
  // ドットマーカーの有無
  const hasMarker = marking?.marked;
  // 日付の色を取得
  const dayColor = getDayColor(date?.dateString, state, isSelected);

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        dynamicStyles.dayContainer,
        {
          borderRightWidth: 1,
          borderRightColor: "#E5E5E5",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E5E5",
        },
      ]}
      onPress={() => date && onPress(date.dateString)}
      activeOpacity={0.6}
    >
      {isSelected && (
        <View style={[styles.selectedDay, dynamicStyles.selectedDay]} />
      )}
      <Text
        style={[
          styles.dayText,
          dynamicStyles.dayText,
          isSelected
            ? { color: "#fff", fontWeight: "bold" }
            : { color: dayColor },
          isToday && styles.todayText,
        ]}
      >
        {date?.day}
      </Text>
      {hasMarker && <View style={[styles.dot, marking.dotStyle]} />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "relative",
    paddingVertical: 0, // 縦方向のパディングを0に
    paddingHorizontal: 0, // 横方向のパディングも0に
  },
  selectedDay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.selected,
  },
  dayText: {
    fontWeight: "normal", // 太字ではなく通常の太さに
    color: "#333",
    zIndex: 1,
    margin: 0, // マージンを0に
  },
  todayText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  dot: {
    width: 6, // サイズを少し大きく
    height: 6,
    borderRadius: 3,
    marginTop: 2, // 少し下に
    zIndex: 1,
  },
});
