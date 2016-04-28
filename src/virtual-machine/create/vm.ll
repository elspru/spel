; ModuleID = 'source/vm.cpp'
target datalayout = "e-p:32:32:32-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-v64:64:64-v128:64:128-a0:0:64-n32-S64"
target triple = "armv6-unknown-linux-gnueabihf"

@.str = private unnamed_addr constant [24 x i8] c"1ce7h tcat ca clah kxih\00", align 1
@.str1 = private unnamed_addr constant [13 x i8] c"hello world\0A\00", align 1
@.str2 = private unnamed_addr constant [4 x i8] c"%s\0A\00", align 1
@.str3 = private unnamed_addr constant [4 x i8] c"%X\0A\00", align 1

define i32 @main() #0 {
  %1 = alloca i32, align 4
  %text = alloca i8*, align 4
  %length = alloca i16, align 2
  %DAT_text = alloca [255 x i8], align 1
  %DAT_GEN_length = alloca i16, align 2
  %DAT_word = alloca [6 x i8], align 1
  %DAT_word_GEN_length = alloca i8, align 1
  %DAT_number = alloca i16, align 2
  store i32 0, i32* %1
  store i8* getelementptr inbounds ([24 x i8]* @.str, i32 0, i32 0), i8** %text, align 4
  store i16 18, i16* %length, align 2
  store i16 255, i16* %DAT_GEN_length, align 2
  store i8 5, i8* %DAT_word_GEN_length, align 1
  store i16 0, i16* %DAT_number, align 2
  %2 = bitcast [255 x i8]* %DAT_text to i8*
  call void @llvm.memset.p0i8.i32(i8* %2, i8 0, i32 255, i32 1, i1 false)
  %3 = bitcast [6 x i8]* %DAT_word to i8*
  call void @llvm.memset.p0i8.i32(i8* %3, i8 0, i32 6, i32 1, i1 false)
  %4 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([13 x i8]* @.str1, i32 0, i32 0))
  %5 = load i8** %text, align 4
  %6 = getelementptr inbounds [255 x i8]* %DAT_text, i32 0, i32 0
  call void @delete_empty_glyph(i8* %5, i16 zeroext 18, i8* %6, i16* %DAT_GEN_length)
  %7 = getelementptr inbounds [255 x i8]* %DAT_text, i32 0, i32 0
  %8 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str2, i32 0, i32 0), i8* %7)
  %9 = getelementptr inbounds [255 x i8]* %DAT_text, i32 0, i32 0
  %10 = load i16* %DAT_GEN_length, align 2
  %11 = trunc i16 %10 to i8
  %12 = getelementptr inbounds [6 x i8]* %DAT_word, i32 0, i32 0
  call void @derive_first_word(i8* %9, i8 zeroext %11, i8* %12, i8* %DAT_word_GEN_length)
  %13 = getelementptr inbounds [6 x i8]* %DAT_word, i32 0, i32 0
  %14 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str2, i32 0, i32 0), i8* %13)
  %15 = getelementptr inbounds [6 x i8]* %DAT_word, i32 0, i32 0
  %16 = load i8* %DAT_word_GEN_length, align 1
  call void @encode_ACC_word_DAT_number(i8* %15, i8 zeroext %16, i16* %DAT_number)
  %17 = load i16* %DAT_number, align 2
  %18 = zext i16 %17 to i32
  %19 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str3, i32 0, i32 0), i32 %18)
  ret i32 0
}

; Function Attrs: nounwind
declare void @llvm.memset.p0i8.i32(i8* nocapture, i8, i32, i32, i1) #1

declare i32 @printf(i8*, ...) #0

declare void @delete_empty_glyph(i8*, i16 zeroext, i8*, i16*) #0

declare void @derive_first_word(i8*, i8 zeroext, i8*, i8*) #0

declare void @encode_ACC_word_DAT_number(i8*, i8 zeroext, i16*) #0

attributes #0 = { "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { nounwind }

!llvm.ident = !{!0}

!0 = metadata !{metadata !"Ubuntu clang version 3.4-1ubuntu3 (tags/RELEASE_34/final) (based on LLVM 3.4)"}
