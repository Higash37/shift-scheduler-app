/**
 * Firebase シフト管理モジュール
 *
 * シフトのCRUD操作と状態管理を提供します。
 */

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { Shift, ShiftStatus } from "@/common/common-models/ModelIndex";
import { db } from "./firebase-core";

/**
 * シフト関連のサービス
 * シフトのCRUD操作と状態管理を提供します
 */
export const ShiftService = {
  /**
   * シフト一覧を取得します
   */
  getShifts: async (): Promise<Shift[]> => {
    try {
      const shiftsRef = collection(db, "shifts");
      const q = query(
        shiftsRef,
        orderBy("date", "asc"),
        orderBy("startTime", "asc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || "",
          nickname: data.nickname || "",
          date: data.date || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          type: data.type || "user",
          subject: data.subject || "",
          isCompleted: data.isCompleted || false,
          status: data.status || "draft",
          duration: data.duration || "",
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          classes: data.classes || [],
          requestedChanges: data.requestedChanges || undefined,
          tasks: data.tasks || {},
          comments: data.comments || "",
        };
      });
    } catch (error) {
      console.error("シフトの取得に失敗しました:", error);
      throw error;
    }
  },

  /**
   * 新しいシフトを追加します
   */
  addShift: async (shift: Omit<Shift, "id">): Promise<string> => {
    try {
      const shiftsRef = collection(db, "shifts");
      const docRef = await addDoc(shiftsRef, {
        ...shift,
        type: shift.type || "user",
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("シフトの追加に失敗しました:", error);
      throw error;
    }
  },

  /**
   * 既存のシフトを更新します
   */
  updateShift: async (id: string, shift: Partial<Shift>): Promise<void> => {
    try {
      const shiftRef = doc(db, "shifts", id);
      await updateDoc(shiftRef, {
        ...shift,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("シフトの更新に失敗しました:", error);
      throw error;
    }
  },

  /**
   * シフトを削除します
   */
  markShiftAsDeleted: async (id: string): Promise<void> => {
    try {
      const shiftRef = doc(db, "shifts", id);
      await deleteDoc(shiftRef);
    } catch (error) {
      console.error("シフトの削除に失敗しました:", error);
      throw error;
    }
  },

  /**
   * シフト変更を承認します
   */
  approveShiftChanges: async (id: string): Promise<void> => {
    try {
      const shiftRef = doc(db, "shifts", id);
      const shiftDoc = await getDoc(shiftRef);
      const shiftData = shiftDoc.data();

      if (shiftData?.requestedChanges) {
        await updateDoc(shiftRef, {
          ...shiftData.requestedChanges,
          status: "approved",
          requestedChanges: null,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("シフトの変更承認に失敗しました:", error);
      throw error;
    }
  },

  /**
   * シフトを完了状態にします
   */
  markShiftAsCompleted: async (id: string): Promise<void> => {
    try {
      const shiftRef = doc(db, "shifts", id);
      await updateDoc(shiftRef, {
        status: "completed",
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("シフトの完了状態への更新に失敗しました:", error);
      throw error;
    }
  },

  /**
   * シフトデータにタスク回数とコメントを追加します
   */
  updateShiftWithTasks: async (
    id: string,
    tasks: { [key: string]: { count: number; time: number } },
    comments: string
  ): Promise<void> => {
    try {
      const shiftRef = doc(db, "shifts", id);
      console.log("Updating shift with tasks:", { id, tasks, comments }); // ログ追加
      await updateDoc(shiftRef, {
        tasks,
        comments,
        status: "completed", // ステータスを完了に更新
        updatedAt: serverTimestamp(),
      });
      console.log("Shift updated successfully:", { id, tasks, comments }); // 成功ログ
    } catch (error) {
      console.error("シフトの更新に失敗しました:", error);
      throw error;
    }
  },

  /**
   * シフト報告を保存します
   */
  addShiftReport: async (
    shiftId: string,
    reportData: {
      taskCounts: Record<string, { count: number; time: number }>;
      comments: string;
    }
  ) => {
    try {
      const reportsRef = collection(db, "reports");
      await addDoc(reportsRef, {
        shiftId,
        taskCounts: reportData.taskCounts,
        comments: reportData.comments,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("シフト報告の保存に失敗しました:", error);
      throw error;
    }
  },
};

// エクスポート
export const {
  getShifts,
  addShift,
  updateShift,
  markShiftAsDeleted,
  approveShiftChanges,
  markShiftAsCompleted,
  updateShiftWithTasks,
  addShiftReport,
} = ShiftService;
