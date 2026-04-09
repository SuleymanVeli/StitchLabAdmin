"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/notesform.module.css";

interface NoteFormData {
  title: string;
  path: string;
  content: string;
}

export default function NoteFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // URL-dən ?id=... götürürük
  const isEditMode = Boolean(id);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<NoteFormData>({
    defaultValues: { title: "", path: "", content: "" }
  });

  // Əgər Edit rejimindəyiksə, mövcud məlumatları API-dən çəkirik
  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/notes?id=${id}`)
        .then((res) => res.json())
        .then((data) => reset(data))
        .catch((err) => console.error("Yükləmə xətası:", err));
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: NoteFormData) => {
    const url = isEditMode ? `/api/notes?id=${id}` : "/api/notes";
    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/notes");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {isEditMode ? "Notu Redaktə Et" : "Yeni Not Yarat"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Title */}
        <div className={styles.field}>
          <label>Başlıq</label>
          <input
            {...register("title", { required: "Başlıq yazılmalıdır" })}
            className={errors.title ? styles.inputError : styles.input}
          />
          {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
        </div>

        {/* Path (Qovluq iyerarxiyası) */}
        <div className={styles.field}>
          <label>Struktur (Path)</label>
          <input
            {...register("path")}
            placeholder="folder/subfolder"
            className={styles.input}
          />
          <small className={styles.hint}>Nümunə: work/projects və ya boş buraxın</small>
        </div>

        {/* Markdown Content (Textarea) */}
        <div className={styles.field}>
          <label>Məzmun (Markdown)</label>
          <textarea
            {...register("content", { required: "Məzmun boş ola bilməz" })}
            rows={12}
            className={errors.content ? styles.inputError : styles.textarea}
          />
          {errors.content && <p className={styles.errorText}>{errors.content.message}</p>}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
            Ləğv et
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "Gözləyin..." : isEditMode ? "Yenilə" : "Yarat"}
          </button>
        </div>
      </form>
    </div>
  );
}