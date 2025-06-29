import React from "react";
import { View } from "react-native";
import {
  ShiftItem,
  ShiftStatus,
  ShiftStatusConfig,
} from "@/common/common-models/ModelIndex";
import {
  DateCell,
  GanttChartGrid,
  GanttChartInfo,
  EmptyCell,
} from "./components";

interface GanttChartRowProps {
  date: string;
  group: ShiftItem[];
  dateColumnWidth: number;
  ganttColumnWidth: number;
  infoColumnWidth: number;
  cellWidth: number;
  halfHourLines: string[];
  isClassTime: (time: string) => boolean;
  getStatusConfig: (status: string) => ShiftStatusConfig;
  handleShiftPress: (shift: ShiftItem) => void;
  handleEmptyCellClick: (date: string, position: number) => void;
  onTimeChange?: (
    shiftId: string,
    newStartTime: string,
    newEndTime: string
  ) => void;
  styles: any;
  userColorsMap: Record<string, string>;
  statusStyles?: (status: ShiftStatus) => {
    borderColor: string;
    color: string;
  };
}

export const GanttChartRow: React.FC<GanttChartRowProps> = ({
  date,
  group,
  dateColumnWidth,
  ganttColumnWidth,
  infoColumnWidth,
  cellWidth,
  halfHourLines,
  isClassTime,
  getStatusConfig,
  handleShiftPress,
  handleEmptyCellClick,
  onTimeChange,
  styles,
  userColorsMap,
  statusStyles,
}) => {
  if (group && group.length > 0) {
    // シフトがある日
    return (
      <View key={date} style={styles.shiftRow}>
        <DateCell
          date={date}
          dateColumnWidth={dateColumnWidth}
          styles={styles}
        />
        <GanttChartGrid
          shifts={group}
          cellWidth={cellWidth}
          ganttColumnWidth={ganttColumnWidth}
          halfHourLines={halfHourLines}
          isClassTime={isClassTime}
          getStatusConfig={getStatusConfig}
          onShiftPress={handleShiftPress}
          onBackgroundPress={(x) => {
            const position =
              (x / ganttColumnWidth) * ((halfHourLines.length - 1) / 2);
            handleEmptyCellClick(date, position);
          }}
          onTimeChange={onTimeChange}
          styles={styles}
          userColorsMap={userColorsMap}
        />
        <GanttChartInfo
          shifts={group}
          getStatusConfig={getStatusConfig}
          onShiftPress={handleShiftPress}
          onDelete={() => {}}
          infoColumnWidth={infoColumnWidth}
          styles={styles}
        />
      </View>
    );
  } else {
    // シフトがない日
    return (
      <View key={date} style={styles.shiftRow}>
        <DateCell
          date={date}
          dateColumnWidth={dateColumnWidth}
          styles={styles}
        />
        <EmptyCell
          date={date}
          width={ganttColumnWidth}
          cellWidth={cellWidth}
          halfHourLines={halfHourLines}
          isClassTime={isClassTime}
          styles={styles}
          handleEmptyCellClick={handleEmptyCellClick}
        />
        <View style={[styles.emptyInfoCell, { width: infoColumnWidth }]} />
      </View>
    );
  }
};
