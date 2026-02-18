!include "MUI2.nsh"

; --------------------------------
; تشغيل الكود عند بداية التثبيت
; --------------------------------
!macro customInstall
  ; 1. إنشاء اختصار سطح المكتب بالاسم العربي
  SetShellVarContext current
  CreateShortCut "$DESKTOP\الريّان.lnk" "$INSTDIR\Al Rayyan.exe" "" "$INSTDIR\resources\icon.ico" 0 "" "" "تطبيق الريّان"

  ; 2. إنشاء اختصار قائمة إبدأ بالاسم العربي
  CreateDirectory "$SMPROGRAMS\الريّان"
  CreateShortCut "$SMPROGRAMS\الريّان\الريّان.lnk" "$INSTDIR\Al Rayyan.exe" "" "$INSTDIR\resources\icon.ico" 0 "" "" "تطبيق الريّان"
  CreateShortCut "$SMPROGRAMS\الريّان\حذف البرنامج.lnk" "$INSTDIR\Uninstall Al Rayyan.exe" "" "" 0
!macroend

; --------------------------------
; تشغيل الكود عند الحذف (Uninstall)
; --------------------------------
!macro customUnInstall
  ; 1. حذف الاختصارات العربية عند إزالة البرنامج
  SetShellVarContext current
  Delete "$DESKTOP\الريّان.lnk"
  
  ; 2. حذف مجلد قائمة إبدأ
  RMDir /r "$SMPROGRAMS\الريّان"
!macroend

; --------------------------------
; رسائل الترحيب والانتهاء (تظهر للمستخدم)
; --------------------------------
!define MUI_WELCOMEPAGE_TITLE "مرحباً بك في مُثبِّت الريّان"
!define MUI_WELCOMEPAGE_TEXT "سيقوم هذا المعالج بتثبيت تطبيق الريّان على جهازك.$\r$\n$\r$\nيوصى بإغلاق كافة التطبيقات الأخرى قبل المتابعة."
!define MUI_FINISHPAGE_RUN_TEXT "تشغيل برنامج الريّان"