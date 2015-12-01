; ModuleID = 'lank-vm.cpp'
target datalayout = "e-p:32:32:32-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-v64:64:64-v128:64:128-a0:0:64-n32-S64"
target triple = "armv6-unknown-linux-gnueabihf"

%struct._IO_FILE = type { i32, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, i8*, %struct._IO_marker*, %struct._IO_FILE*, i32, i32, i32, i16, i8, [1 x i8], i8*, i64, i8*, i8*, i8*, i8*, i32, i32, [40 x i8] }
%struct._IO_marker = type { %struct._IO_marker*, %struct._IO_FILE*, i32 }

@.str = private unnamed_addr constant [43 x i8] c"memory[0x20+1+0] <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str1 = private unnamed_addr constant [12 x i8] c"lank-vm.cpp\00", align 1
@__PRETTY_FUNCTION__.run = private unnamed_addr constant [55 x i8] c"void run(const uint32_t *, const uint32_t, uint32_t *)\00", align 1
@.str2 = private unnamed_addr constant [16 x i8] c"PC %X INSTR %X\0A\00", align 1
@.str3 = private unnamed_addr constant [4 x i8] c"%s\0A\00", align 1
@_ZZ4mainE4prog = private unnamed_addr constant [10 x i32] [i32 294, i32 -1688681770, i32 1010303076, i32 -1688681770, i32 976748744, i32 875348282, i32 -1688681770, i32 1496842424, i32 875350100, i32 875340433], align 4
@_ZZ4mainE10lankGlyphs = internal constant [9 x i8] c"salhmunt\00", align 1
@_ZZ4mainE10lankResult = private unnamed_addr constant [5 x i8] c"    \00", align 1
@.str4 = private unnamed_addr constant [15 x i8] c"progLength > 0\00", align 1
@__PRETTY_FUNCTION__.main = private unnamed_addr constant [11 x i8] c"int main()\00", align 1
@.str5 = private unnamed_addr constant [11 x i8] c"nibble %X\0A\00", align 1
@.str6 = private unnamed_addr constant [21 x i8] c"glyphs %s result %s\0A\00", align 1
@.str7 = private unnamed_addr constant [17 x i8] c"glyphs != __null\00", align 1
@__PRETTY_FUNCTION__._Z17lankGlyphsToChar8iPKciPc = private unnamed_addr constant [67 x i8] c"void lankGlyphsToChar8(const int, const char *, const int, char *)\00", align 1
@.str8 = private unnamed_addr constant [17 x i8] c"result != __null\00", align 1
@.str9 = private unnamed_addr constant [37 x i8] c"resultLength-1 == (glyphsLength-1)/2\00", align 1
@.str10 = private unnamed_addr constant [13 x i8] c"glyph >= '.'\00", align 1
@__PRETTY_FUNCTION__._Z17lankGlyphToNibblec = private unnamed_addr constant [39 x i8] c"uint32_t lankGlyphToNibble(const char)\00", align 1
@.str11 = private unnamed_addr constant [13 x i8] c"glyph <= 'w'\00", align 1
@.str12 = private unnamed_addr constant [33 x i8] c"lankGlyphToNibble: invalid glyph\00", align 1
@.str13 = private unnamed_addr constant [14 x i8] c"result <= 0xF\00", align 1
@stderr = external global %struct._IO_FILE*
@.str14 = private unnamed_addr constant [18 x i8] c"memory[0x20] == 1\00", align 1
@__PRETTY_FUNCTION__._Z4evalPjPb = private unnamed_addr constant [30 x i8] c"void eval(uint32_t *, bool *)\00", align 1
@.str15 = private unnamed_addr constant [13 x i8] c"command != 0\00", align 1
@.str16 = private unnamed_addr constant [6 x i8] c"exit\0A\00", align 1
@.str17 = private unnamed_addr constant [37 x i8] c"memory[0x10+0x5] == memory[0x10+0xA]\00", align 1
@.str18 = private unnamed_addr constant [7 x i8] c"added\0A\00", align 1
@.str19 = private unnamed_addr constant [37 x i8] c"memory[0x10+0x6] == memory[0x10+0xA]\00", align 1
@.str20 = private unnamed_addr constant [12 x i8] c"subtracted\0A\00", align 1
@.str21 = private unnamed_addr constant [22 x i8] c"eval: unknown command\00", align 1
@.str22 = private unnamed_addr constant [17 x i8] c"memory != __null\00", align 1
@__PRETTY_FUNCTION__._Z9printRegsPKj = private unnamed_addr constant [33 x i8] c"void printRegs(const uint32_t *)\00", align 1
@.str23 = private unnamed_addr constant [13 x i8] c"registers: \0A\00", align 1
@.str24 = private unnamed_addr constant [19 x i8] c"      Value\09Type \0A\00", align 1
@.str25 = private unnamed_addr constant [18 x i8] c" IMM    %d\090x%X,\0A\00", align 1
@.str26 = private unnamed_addr constant [18 x i8] c" HEY    %d\090x%X,\0A\00", align 1
@.str27 = private unnamed_addr constant [18 x i8] c" ABOUT  %d\090x%X,\0A\00", align 1
@.str28 = private unnamed_addr constant [18 x i8] c" SU     %d\090x%X,\0A\00", align 1
@.str29 = private unnamed_addr constant [18 x i8] c" OF     %d\090x%X,\0A\00", align 1
@.str30 = private unnamed_addr constant [18 x i8] c" TO     %d\090x%X,\0A\00", align 1
@.str31 = private unnamed_addr constant [18 x i8] c" FROM   %d\090x%X,\0A\00", align 1
@.str32 = private unnamed_addr constant [18 x i8] c" BY     %d\090x%X,\0A\00", align 1
@.str33 = private unnamed_addr constant [18 x i8] c" BE     %d\090x%X,\0A\00", align 1
@.str34 = private unnamed_addr constant [18 x i8] c" OB     %d\090x%X,\0A\00", align 1
@.str35 = private unnamed_addr constant [18 x i8] c" DATAP  %d\090x%X,\0A\00", align 1
@.str36 = private unnamed_addr constant [18 x i8] c" STACKP %d\090x%X,\0A\00", align 1
@.str37 = private unnamed_addr constant [18 x i8] c" PC     %d\090x%X,\0A\00", align 1
@.str38 = private unnamed_addr constant [18 x i8] c"printedLength > 0\00", align 1
@__PRETTY_FUNCTION__._Z18wholePhraseToGlyphPKjPc = private unnamed_addr constant [50 x i8] c"void wholePhraseToGlyph(const uint32_t *, char *)\00", align 1
@.str39 = private unnamed_addr constant [17 x i8] c"memory[0x20] > 0\00", align 1
@.str40 = private unnamed_addr constant [32 x i8] c"memory[0x20] <= (uint32_t) 0xFU\00", align 1
@.str41 = private unnamed_addr constant [34 x i8] c"intWord <= (uint32_t) 0xFFFFFFFFU\00", align 1
@__PRETTY_FUNCTION__._Z24EightNibblesToLankGlyphsjPc = private unnamed_addr constant [54 x i8] c"void EightNibblesToLankGlyphs(const uint32_t, char *)\00", align 1
@.str42 = private unnamed_addr constant [14 x i8] c"nibble <= 0xF\00", align 1
@__PRETTY_FUNCTION__._Z17nibbleToLankGlyphj = private unnamed_addr constant [39 x i8] c"char nibbleToLankGlyph(const uint32_t)\00", align 1
@.str43 = private unnamed_addr constant [34 x i8] c"nibbleToLankGlyph: invalid nibble\00", align 1
@.str44 = private unnamed_addr constant [30 x i8] c"result >= '.' && result <='z'\00", align 1
@.str45 = private unnamed_addr constant [17 x i8] c"memory[0x20] > 1\00", align 1
@__PRETTY_FUNCTION__._Z6decodePj = private unnamed_addr constant [24 x i8] c"void decode(uint32_t *)\00", align 1
@.str46 = private unnamed_addr constant [24 x i8] c"immediateLengthWord > 0\00", align 1
@.str47 = private unnamed_addr constant [30 x i8] c"0xFFFF >= immediateLengthWord\00", align 1
@.str48 = private unnamed_addr constant [41 x i8] c"immediateValue <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str49 = private unnamed_addr constant [36 x i8] c"decode: unknown immediateLengthWord\00", align 1
@.str50 = private unnamed_addr constant [33 x i8] c"phraseDecode: unknown phraseWord\00", align 1
@__PRETTY_FUNCTION__._Z5fetchPKjjPj = private unnamed_addr constant [57 x i8] c"void fetch(const uint32_t *, const uint32_t, uint32_t *)\00", align 1
@.str51 = private unnamed_addr constant [27 x i8] c"PC exceeded end of program\00", align 1
@.str52 = private unnamed_addr constant [25 x i8] c"memory[0xF] < progLength\00", align 1
@.str53 = private unnamed_addr constant [29 x i8] c"currentBit < (uint32_t) 0xFU\00", align 1
@.str54 = private unnamed_addr constant [32 x i8] c"batchIndex < (uint32_t) 0xFFFFU\00", align 1
@.str55 = private unnamed_addr constant [29 x i8] c"maxLength <= (uint32_t) 0xFU\00", align 1
@.str56 = private unnamed_addr constant [32 x i8] c"memory[0x20] <= remainingLength\00", align 1
@.str57 = private unnamed_addr constant [26 x i8] c"memory[0x20] <= maxLength\00", align 1
@.str58 = private unnamed_addr constant [37 x i8] c"phraseWord <= (uint32_t) 0xFFFFFFFFU\00", align 1
@.str59 = private unnamed_addr constant [32 x i8] c"number < (uint32_t) 0xFFFFFFFFU\00", align 1
@__PRETTY_FUNCTION__._Z16amountOfSameBitsjj = private unnamed_addr constant [58 x i8] c"uint32_t amountOfSameBits(const uint32_t, const uint32_t)\00", align 1
@.str60 = private unnamed_addr constant [38 x i8] c"maxLength <= (uint32_t) sizeof(int)*8\00", align 1
@.str61 = private unnamed_addr constant [25 x i8] c"firstBit <= (uint32_t) 1\00", align 1
@.str62 = private unnamed_addr constant [20 x i8] c"length <= maxLength\00", align 1

define void @run(i32* %prog, i32 %progLength, i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i32, align 4
  %3 = alloca i32*, align 4
  %i = alloca i32, align 4
  %running = alloca i8, align 1
  %glyphs = alloca [9 x i8], align 1
  store i32* %prog, i32** %1, align 4
  store i32 %progLength, i32* %2, align 4
  store i32* %memory, i32** %3, align 4
  store i32 0, i32* %i, align 4
  store i8 1, i8* %running, align 1
  %4 = bitcast [9 x i8]* %glyphs to i8*
  call void @llvm.memset.p0i8.i32(i8* %4, i8 0, i32 9, i32 1, i1 false)
  store i32 0, i32* %i, align 4
  br label %5

; <label>:5                                       ; preds = %40, %0
  %6 = load i32* %i, align 4
  %7 = load i32* %2, align 4
  %8 = icmp ult i32 %6, %7
  br i1 %8, label %9, label %43

; <label>:9                                       ; preds = %5
  %10 = load i32** %1, align 4
  %11 = load i32* %2, align 4
  %12 = load i32** %3, align 4
  call void @_Z5fetchPKjjPj(i32* %10, i32 %11, i32* %12)
  %13 = load i32** %3, align 4
  call void @_Z6decodePj(i32* %13)
  %14 = load i32** %3, align 4
  %15 = getelementptr inbounds i32* %14, i32 33
  %16 = load i32* %15, align 4
  %17 = icmp ule i32 %16, -1
  br i1 %17, label %18, label %19

; <label>:18                                      ; preds = %9
  br label %21

; <label>:19                                      ; preds = %9
  call void @__assert_fail(i8* getelementptr inbounds ([43 x i8]* @.str, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 448, i8* getelementptr inbounds ([55 x i8]* @__PRETTY_FUNCTION__.run, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %21

; <label>:21                                      ; preds = %20, %18
  %22 = load i32** %3, align 4
  %23 = getelementptr inbounds i32* %22, i32 15
  %24 = load i32* %23, align 4
  %25 = load i32** %3, align 4
  %26 = getelementptr inbounds i32* %25, i32 33
  %27 = load i32* %26, align 4
  %28 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([16 x i8]* @.str2, i32 0, i32 0), i32 %24, i32 %27)
  %29 = load i32** %3, align 4
  %30 = getelementptr inbounds [9 x i8]* %glyphs, i32 0, i32 0
  call void @_Z18wholePhraseToGlyphPKjPc(i32* %29, i8* %30)
  %31 = getelementptr inbounds [9 x i8]* %glyphs, i32 0, i32 0
  %32 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str3, i32 0, i32 0), i8* %31)
  %33 = load i32** %3, align 4
  call void @_Z4evalPjPb(i32* %33, i8* %running)
  %34 = load i8* %running, align 1
  %35 = trunc i8 %34 to i1
  %36 = zext i1 %35 to i32
  %37 = icmp eq i32 %36, 0
  br i1 %37, label %38, label %39

; <label>:38                                      ; preds = %21
  br label %43

; <label>:39                                      ; preds = %21
  br label %40

; <label>:40                                      ; preds = %39
  %41 = load i32* %i, align 4
  %42 = add i32 %41, 1
  store i32 %42, i32* %i, align 4
  br label %5

; <label>:43                                      ; preds = %38, %5
  ret void
}

; Function Attrs: nounwind
declare void @llvm.memset.p0i8.i32(i8* nocapture, i8, i32, i32, i1) #1

define internal void @_Z5fetchPKjjPj(i32* %prog, i32 %progLength, i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i32, align 4
  %3 = alloca i32*, align 4
  %batchIndex = alloca i32, align 4
  %currentBit = alloca i32, align 4
  %phraseWord = alloca i32, align 4
  %maxLength = alloca i32, align 4
  %i = alloca i32, align 4
  %remainingLength = alloca i32, align 4
  store i32* %prog, i32** %1, align 4
  store i32 %progLength, i32* %2, align 4
  store i32* %memory, i32** %3, align 4
  store i32 0, i32* %batchIndex, align 4
  store i32 0, i32* %currentBit, align 4
  store i32 0, i32* %phraseWord, align 4
  store i32 15, i32* %maxLength, align 4
  store i32 0, i32* %remainingLength, align 4
  %4 = load i32** %3, align 4
  %5 = icmp ne i32* %4, null
  br i1 %5, label %6, label %7

; <label>:6                                       ; preds = %0
  br label %9

; <label>:7                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str22, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 117, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %9

; <label>:9                                       ; preds = %8, %6
  %10 = load i32** %3, align 4
  %11 = getelementptr inbounds i32* %10, i32 15
  %12 = load i32* %11, align 4
  %13 = load i32* %2, align 4
  %14 = icmp uge i32 %12, %13
  br i1 %14, label %15, label %16

; <label>:15                                      ; preds = %9
  call void @_Z5errorPKc(i8* getelementptr inbounds ([27 x i8]* @.str51, i32 0, i32 0))
  br label %16

; <label>:16                                      ; preds = %15, %9
  %17 = load i32** %3, align 4
  %18 = getelementptr inbounds i32* %17, i32 15
  %19 = load i32* %18, align 4
  %20 = load i32* %2, align 4
  %21 = icmp ult i32 %19, %20
  br i1 %21, label %22, label %23

; <label>:22                                      ; preds = %16
  br label %25

; <label>:23                                      ; preds = %16
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str52, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 121, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %25

; <label>:25                                      ; preds = %24, %22
  %26 = load i32** %3, align 4
  %27 = getelementptr inbounds i32* %26, i32 15
  %28 = load i32* %27, align 4
  %29 = urem i32 %28, 15
  store i32 %29, i32* %currentBit, align 4
  %30 = load i32** %3, align 4
  %31 = getelementptr inbounds i32* %30, i32 15
  %32 = load i32* %31, align 4
  %33 = load i32* %currentBit, align 4
  %34 = sub i32 %32, %33
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 %34
  %37 = load i32* %36, align 4
  store i32 %37, i32* %batchIndex, align 4
  %38 = load i32* %currentBit, align 4
  %39 = icmp eq i32 %38, 0
  br i1 %39, label %40, label %49

; <label>:40                                      ; preds = %25
  %41 = load i32** %3, align 4
  %42 = getelementptr inbounds i32* %41, i32 15
  %43 = load i32* %42, align 4
  %44 = add i32 %43, 1
  %45 = load i32** %3, align 4
  %46 = getelementptr inbounds i32* %45, i32 15
  store i32 %44, i32* %46, align 4
  %47 = load i32* %currentBit, align 4
  %48 = add i32 %47, 1
  store i32 %48, i32* %currentBit, align 4
  br label %49

; <label>:49                                      ; preds = %40, %25
  %50 = load i32* %currentBit, align 4
  %51 = icmp ult i32 %50, 15
  br i1 %51, label %52, label %53

; <label>:52                                      ; preds = %49
  br label %55

; <label>:53                                      ; preds = %49
  call void @__assert_fail(i8* getelementptr inbounds ([29 x i8]* @.str53, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 129, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %55

; <label>:55                                      ; preds = %54, %52
  %56 = load i32* %batchIndex, align 4
  %57 = load i32* %currentBit, align 4
  %58 = lshr i32 %56, %57
  store i32 %58, i32* %batchIndex, align 4
  %59 = load i32* %batchIndex, align 4
  %60 = icmp ult i32 %59, 65535
  br i1 %60, label %61, label %62

; <label>:61                                      ; preds = %55
  br label %64

; <label>:62                                      ; preds = %55
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str54, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 131, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %64

; <label>:64                                      ; preds = %63, %61
  %65 = load i32* %2, align 4
  %66 = load i32** %3, align 4
  %67 = getelementptr inbounds i32* %66, i32 15
  %68 = load i32* %67, align 4
  %69 = sub i32 %65, %68
  store i32 %69, i32* %remainingLength, align 4
  %70 = load i32* %remainingLength, align 4
  %71 = icmp ult i32 %70, 15
  br i1 %71, label %72, label %77

; <label>:72                                      ; preds = %64
  %73 = load i32* %2, align 4
  %74 = urem i32 %73, 14
  %75 = load i32* %currentBit, align 4
  %76 = sub i32 %74, %75
  store i32 %76, i32* %maxLength, align 4
  br label %80

; <label>:77                                      ; preds = %64
  %78 = load i32* %currentBit, align 4
  %79 = sub i32 15, %78
  store i32 %79, i32* %maxLength, align 4
  br label %80

; <label>:80                                      ; preds = %77, %72
  %81 = load i32* %maxLength, align 4
  %82 = icmp ule i32 %81, 15
  br i1 %82, label %83, label %84

; <label>:83                                      ; preds = %80
  br label %86

; <label>:84                                      ; preds = %80
  call void @__assert_fail(i8* getelementptr inbounds ([29 x i8]* @.str55, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 138, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %86

; <label>:86                                      ; preds = %85, %83
  %87 = load i32* %batchIndex, align 4
  %88 = load i32* %maxLength, align 4
  %89 = call i32 @_Z16amountOfSameBitsjj(i32 %87, i32 %88)
  %90 = load i32** %3, align 4
  %91 = getelementptr inbounds i32* %90, i32 32
  store i32 %89, i32* %91, align 4
  %92 = load i32** %3, align 4
  %93 = getelementptr inbounds i32* %92, i32 32
  %94 = load i32* %93, align 4
  %95 = load i32* %remainingLength, align 4
  %96 = icmp ule i32 %94, %95
  br i1 %96, label %97, label %98

; <label>:97                                      ; preds = %86
  br label %100

; <label>:98                                      ; preds = %86
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str56, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 140, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %100

; <label>:100                                     ; preds = %99, %97
  %101 = load i32** %3, align 4
  %102 = getelementptr inbounds i32* %101, i32 32
  %103 = load i32* %102, align 4
  %104 = load i32* %maxLength, align 4
  %105 = icmp ule i32 %103, %104
  br i1 %105, label %106, label %107

; <label>:106                                     ; preds = %100
  br label %109

; <label>:107                                     ; preds = %100
  call void @__assert_fail(i8* getelementptr inbounds ([26 x i8]* @.str57, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 141, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %109

; <label>:109                                     ; preds = %108, %106
  store i32 0, i32* %i, align 4
  br label %110

; <label>:110                                     ; preds = %141, %109
  %111 = load i32* %i, align 4
  %112 = load i32** %3, align 4
  %113 = getelementptr inbounds i32* %112, i32 32
  %114 = load i32* %113, align 4
  %115 = icmp ult i32 %111, %114
  br i1 %115, label %116, label %144

; <label>:116                                     ; preds = %110
  %117 = load i32** %3, align 4
  %118 = getelementptr inbounds i32* %117, i32 15
  %119 = load i32* %118, align 4
  %120 = add i32 %119, 1
  %121 = load i32** %3, align 4
  %122 = getelementptr inbounds i32* %121, i32 15
  store i32 %120, i32* %122, align 4
  %123 = load i32** %3, align 4
  %124 = getelementptr inbounds i32* %123, i32 15
  %125 = load i32* %124, align 4
  %126 = sub i32 %125, 1
  %127 = load i32** %1, align 4
  %128 = getelementptr inbounds i32* %127, i32 %126
  %129 = load i32* %128, align 4
  store i32 %129, i32* %phraseWord, align 4
  %130 = load i32* %phraseWord, align 4
  %131 = icmp ule i32 %130, -1
  br i1 %131, label %132, label %133

; <label>:132                                     ; preds = %116
  br label %135

; <label>:133                                     ; preds = %116
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str58, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 145, i8* getelementptr inbounds ([57 x i8]* @__PRETTY_FUNCTION__._Z5fetchPKjjPj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %135

; <label>:135                                     ; preds = %134, %132
  %136 = load i32* %phraseWord, align 4
  %137 = load i32* %i, align 4
  %138 = add i32 33, %137
  %139 = load i32** %3, align 4
  %140 = getelementptr inbounds i32* %139, i32 %138
  store i32 %136, i32* %140, align 4
  br label %141

; <label>:141                                     ; preds = %135
  %142 = load i32* %i, align 4
  %143 = add i32 %142, 1
  store i32 %143, i32* %i, align 4
  br label %110

; <label>:144                                     ; preds = %110
  ret void
}

define internal void @_Z6decodePj(i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %immediateValue = alloca i32, align 4
  %immediateLengthWord = alloca i32, align 4
  %phraseWord = alloca i32, align 4
  %typeWord = alloca i16, align 2
  store i32* %memory, i32** %1, align 4
  store i32 0, i32* %immediateValue, align 4
  store i32 0, i32* %immediateLengthWord, align 4
  store i32 0, i32* %phraseWord, align 4
  store i16 0, i16* %typeWord, align 2
  %2 = load i32** %1, align 4
  %3 = getelementptr inbounds i32* %2, i32 33
  %4 = load i32* %3, align 4
  %5 = and i32 %4, 49878
  %6 = icmp eq i32 %5, 49878
  br i1 %6, label %7, label %61

; <label>:7                                       ; preds = %0
  %8 = load i32** %1, align 4
  %9 = getelementptr inbounds i32* %8, i32 32
  %10 = load i32* %9, align 4
  %11 = icmp ugt i32 %10, 1
  br i1 %11, label %12, label %13

; <label>:12                                      ; preds = %7
  br label %15

; <label>:13                                      ; preds = %7
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str45, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 380, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %15

; <label>:15                                      ; preds = %14, %12
  %16 = load i32** %1, align 4
  %17 = getelementptr inbounds i32* %16, i32 33
  %18 = load i32* %17, align 4
  %19 = and i32 %18, -65536
  %20 = lshr i32 %19, 16
  store i32 %20, i32* %immediateLengthWord, align 4
  %21 = load i32* %immediateLengthWord, align 4
  %22 = icmp ugt i32 %21, 0
  br i1 %22, label %23, label %24

; <label>:23                                      ; preds = %15
  br label %26

; <label>:24                                      ; preds = %15
  call void @__assert_fail(i8* getelementptr inbounds ([24 x i8]* @.str46, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 383, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %26

; <label>:26                                      ; preds = %25, %23
  %27 = load i32* %immediateLengthWord, align 4
  %28 = icmp uge i32 65535, %27
  br i1 %28, label %29, label %30

; <label>:29                                      ; preds = %26
  br label %32

; <label>:30                                      ; preds = %26
  call void @__assert_fail(i8* getelementptr inbounds ([30 x i8]* @.str47, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 384, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %32

; <label>:32                                      ; preds = %31, %29
  %33 = load i32* %immediateLengthWord, align 4
  switch i32 %33, label %59 [
    i32 39768, label %34
  ]

; <label>:34                                      ; preds = %32
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 34
  %37 = load i32* %36, align 4
  %38 = and i32 %37, 65535
  store i32 %38, i32* %immediateValue, align 4
  %39 = load i32* %immediateValue, align 4
  %40 = icmp ule i32 %39, -1
  br i1 %40, label %41, label %42

; <label>:41                                      ; preds = %34
  br label %44

; <label>:42                                      ; preds = %34
  call void @__assert_fail(i8* getelementptr inbounds ([41 x i8]* @.str48, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 389, i8* getelementptr inbounds ([24 x i8]* @__PRETTY_FUNCTION__._Z6decodePj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %44

; <label>:44                                      ; preds = %43, %41
  %45 = load i32* %immediateValue, align 4
  %46 = load i32** %1, align 4
  %47 = getelementptr inbounds i32* %46, i32 0
  store i32 %45, i32* %47, align 4
  %48 = load i32** %1, align 4
  %49 = getelementptr inbounds i32* %48, i32 34
  %50 = load i32* %49, align 4
  %51 = and i32 %50, -16777216
  %52 = lshr i32 %51, 24
  store i32 %52, i32* %phraseWord, align 4
  %53 = load i32** %1, align 4
  %54 = getelementptr inbounds i32* %53, i32 34
  %55 = load i32* %54, align 4
  %56 = and i32 %55, 16711680
  %57 = lshr i32 %56, 16
  %58 = trunc i32 %57 to i16
  store i16 %58, i16* %typeWord, align 2
  br label %60

; <label>:59                                      ; preds = %32
  call void @_Z5errorPKc(i8* getelementptr inbounds ([36 x i8]* @.str49, i32 0, i32 0))
  br label %60

; <label>:60                                      ; preds = %59, %44
  br label %61

; <label>:61                                      ; preds = %60, %0
  %62 = load i32* %phraseWord, align 4
  %63 = load i16* %typeWord, align 2
  %64 = load i32** %1, align 4
  call void @_Z12phraseDecodejtPj(i32 %62, i16 zeroext %63, i32* %64)
  ret void
}

; Function Attrs: noreturn nounwind
declare void @__assert_fail(i8*, i8*, i32, i8*) #2

declare i32 @printf(i8*, ...) #0

define internal void @_Z18wholePhraseToGlyphPKjPc(i32* %memory, i8* %glyphs) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i8*, align 4
  %i = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i8* %glyphs, i8** %2, align 4
  store i32 0, i32* %i, align 4
  %3 = load i32** %1, align 4
  %4 = icmp ne i32* %3, null
  br i1 %4, label %5, label %6

; <label>:5                                       ; preds = %0
  br label %8

; <label>:6                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str22, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 279, i8* getelementptr inbounds ([50 x i8]* @__PRETTY_FUNCTION__._Z18wholePhraseToGlyphPKjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %8

; <label>:8                                       ; preds = %7, %5
  %9 = load i8** %2, align 4
  %10 = icmp ne i8* %9, null
  br i1 %10, label %11, label %12

; <label>:11                                      ; preds = %8
  br label %14

; <label>:12                                      ; preds = %8
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str7, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 280, i8* getelementptr inbounds ([50 x i8]* @__PRETTY_FUNCTION__._Z18wholePhraseToGlyphPKjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %14

; <label>:14                                      ; preds = %13, %11
  %15 = load i32** %1, align 4
  %16 = getelementptr inbounds i32* %15, i32 32
  %17 = load i32* %16, align 4
  %18 = icmp ugt i32 %17, 0
  br i1 %18, label %19, label %20

; <label>:19                                      ; preds = %14
  br label %22

; <label>:20                                      ; preds = %14
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str39, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 281, i8* getelementptr inbounds ([50 x i8]* @__PRETTY_FUNCTION__._Z18wholePhraseToGlyphPKjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %22

; <label>:22                                      ; preds = %21, %19
  %23 = load i32** %1, align 4
  %24 = getelementptr inbounds i32* %23, i32 32
  %25 = load i32* %24, align 4
  %26 = icmp ule i32 %25, 15
  br i1 %26, label %27, label %28

; <label>:27                                      ; preds = %22
  br label %30

; <label>:28                                      ; preds = %22
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str40, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 282, i8* getelementptr inbounds ([50 x i8]* @__PRETTY_FUNCTION__._Z18wholePhraseToGlyphPKjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %30

; <label>:30                                      ; preds = %29, %27
  store i32 0, i32* %i, align 4
  br label %31

; <label>:31                                      ; preds = %44, %30
  %32 = load i32* %i, align 4
  %33 = load i32** %1, align 4
  %34 = getelementptr inbounds i32* %33, i32 32
  %35 = load i32* %34, align 4
  %36 = icmp ult i32 %32, %35
  br i1 %36, label %37, label %47

; <label>:37                                      ; preds = %31
  %38 = load i32* %i, align 4
  %39 = add i32 33, %38
  %40 = load i32** %1, align 4
  %41 = getelementptr inbounds i32* %40, i32 %39
  %42 = load i32* %41, align 4
  %43 = load i8** %2, align 4
  call void @_Z24EightNibblesToLankGlyphsjPc(i32 %42, i8* %43)
  br label %44

; <label>:44                                      ; preds = %37
  %45 = load i32* %i, align 4
  %46 = add i32 %45, 1
  store i32 %46, i32* %i, align 4
  br label %31

; <label>:47                                      ; preds = %31
  ret void
}

define internal void @_Z4evalPjPb(i32* %memory, i8* %running) #0 {
  %1 = alloca i32*, align 4
  %2 = alloca i8*, align 4
  %command = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i8* %running, i8** %2, align 4
  %3 = load i32** %1, align 4
  %4 = getelementptr inbounds i32* %3, i32 33
  %5 = load i32* %4, align 4
  %6 = and i32 %5, 875298816
  %7 = icmp eq i32 %6, 875298816
  br i1 %7, label %8, label %83

; <label>:8                                       ; preds = %0
  %9 = load i32** %1, align 4
  %10 = getelementptr inbounds i32* %9, i32 32
  %11 = load i32* %10, align 4
  %12 = icmp eq i32 %11, 1
  br i1 %12, label %13, label %14

; <label>:13                                      ; preds = %8
  br label %16

; <label>:14                                      ; preds = %8
  call void @__assert_fail(i8* getelementptr inbounds ([18 x i8]* @.str14, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 411, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %16

; <label>:16                                      ; preds = %15, %13
  %17 = load i32** %1, align 4
  %18 = getelementptr inbounds i32* %17, i32 33
  %19 = load i32* %18, align 4
  %20 = and i32 %19, 65535
  store i32 %20, i32* %command, align 4
  %21 = load i32* %command, align 4
  %22 = icmp ne i32 %21, 0
  br i1 %22, label %23, label %24

; <label>:23                                      ; preds = %16
  br label %26

; <label>:24                                      ; preds = %16
  call void @__assert_fail(i8* getelementptr inbounds ([13 x i8]* @.str15, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 413, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %26

; <label>:26                                      ; preds = %25, %23
  %27 = load i32* %command, align 4
  switch i32 %27, label %81 [
    i32 41617, label %28
    i32 49466, label %31
    i32 51284, label %58
  ]

; <label>:28                                      ; preds = %26
  %29 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([6 x i8]* @.str16, i32 0, i32 0))
  %30 = load i8** %2, align 4
  store i8 0, i8* %30, align 1
  br label %82

; <label>:31                                      ; preds = %26
  %32 = load i32** %1, align 4
  %33 = getelementptr inbounds i32* %32, i32 21
  %34 = load i32* %33, align 4
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 26
  %37 = load i32* %36, align 4
  %38 = icmp eq i32 %34, %37
  br i1 %38, label %39, label %40

; <label>:39                                      ; preds = %31
  br label %42

; <label>:40                                      ; preds = %31
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str17, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 420, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %42

; <label>:42                                      ; preds = %41, %39
  %43 = load i32** %1, align 4
  %44 = getelementptr inbounds i32* %43, i32 5
  %45 = load i32* %44, align 4
  %46 = load i32** %1, align 4
  %47 = getelementptr inbounds i32* %46, i32 10
  %48 = load i32* %47, align 4
  %49 = add i32 %45, %48
  %50 = load i32** %1, align 4
  %51 = getelementptr inbounds i32* %50, i32 6
  %52 = load i32* %51, align 4
  %53 = add i32 %49, %52
  %54 = load i32** %1, align 4
  %55 = getelementptr inbounds i32* %54, i32 5
  store i32 %53, i32* %55, align 4
  %56 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([7 x i8]* @.str18, i32 0, i32 0))
  %57 = load i32** %1, align 4
  call void @_Z9printRegsPKj(i32* %57)
  br label %82

; <label>:58                                      ; preds = %26
  %59 = load i32** %1, align 4
  %60 = getelementptr inbounds i32* %59, i32 22
  %61 = load i32* %60, align 4
  %62 = load i32** %1, align 4
  %63 = getelementptr inbounds i32* %62, i32 26
  %64 = load i32* %63, align 4
  %65 = icmp eq i32 %61, %64
  br i1 %65, label %66, label %67

; <label>:66                                      ; preds = %58
  br label %69

; <label>:67                                      ; preds = %58
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str19, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 426, i8* getelementptr inbounds ([30 x i8]* @__PRETTY_FUNCTION__._Z4evalPjPb, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %69

; <label>:69                                      ; preds = %68, %66
  %70 = load i32** %1, align 4
  %71 = getelementptr inbounds i32* %70, i32 6
  %72 = load i32* %71, align 4
  %73 = load i32** %1, align 4
  %74 = getelementptr inbounds i32* %73, i32 10
  %75 = load i32* %74, align 4
  %76 = sub i32 %72, %75
  %77 = load i32** %1, align 4
  %78 = getelementptr inbounds i32* %77, i32 5
  store i32 %76, i32* %78, align 4
  %79 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([12 x i8]* @.str20, i32 0, i32 0))
  %80 = load i32** %1, align 4
  call void @_Z9printRegsPKj(i32* %80)
  br label %82

; <label>:81                                      ; preds = %26
  call void @_Z5errorPKc(i8* getelementptr inbounds ([22 x i8]* @.str21, i32 0, i32 0))
  br label %82

; <label>:82                                      ; preds = %81, %69, %42, %28
  br label %83

; <label>:83                                      ; preds = %82, %0
  ret void
}

define i32 @main() #0 {
  %1 = alloca i32, align 4
  %prog = alloca [10 x i32], align 4
  %progLength = alloca i32, align 4
  %memory = alloca [96 x i32], align 4
  %nibble = alloca i32, align 4
  %lankResult = alloca [5 x i8], align 1
  store i32 0, i32* %1
  %2 = bitcast [10 x i32]* %prog to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* %2, i8* bitcast ([10 x i32]* @_ZZ4mainE4prog to i8*), i32 40, i32 4, i1 false)
  store i32 10, i32* %progLength, align 4
  %3 = bitcast [5 x i8]* %lankResult to i8*
  call void @llvm.memcpy.p0i8.p0i8.i32(i8* %3, i8* getelementptr inbounds ([5 x i8]* @_ZZ4mainE10lankResult, i32 0, i32 0), i32 5, i32 1, i1 false)
  %4 = bitcast [96 x i32]* %memory to i8*
  call void @llvm.memset.p0i8.i32(i8* %4, i8 0, i32 384, i32 4, i1 false)
  %5 = load i32* %progLength, align 4
  %6 = icmp ugt i32 %5, 0
  br i1 %6, label %7, label %8

; <label>:7                                       ; preds = %0
  br label %10

; <label>:8                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([15 x i8]* @.str4, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 481, i8* getelementptr inbounds ([11 x i8]* @__PRETTY_FUNCTION__.main, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %10

; <label>:10                                      ; preds = %9, %7
  %11 = getelementptr inbounds [10 x i32]* %prog, i32 0, i32 0
  %12 = load i32* %progLength, align 4
  %13 = getelementptr inbounds [96 x i32]* %memory, i32 0, i32 0
  call void @run(i32* %11, i32 %12, i32* %13)
  %14 = call i32 @_Z17lankGlyphToNibblec(i8 zeroext 109)
  store i32 %14, i32* %nibble, align 4
  %15 = load i32* %nibble, align 4
  %16 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([11 x i8]* @.str5, i32 0, i32 0), i32 %15)
  %17 = getelementptr inbounds [5 x i8]* %lankResult, i32 0, i32 0
  call void @_Z17lankGlyphsToChar8iPKciPc(i32 9, i8* getelementptr inbounds ([9 x i8]* @_ZZ4mainE10lankGlyphs, i32 0, i32 0), i32 5, i8* %17)
  %18 = getelementptr inbounds [5 x i8]* %lankResult, i32 0, i32 0
  %19 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([21 x i8]* @.str6, i32 0, i32 0), i8* getelementptr inbounds ([9 x i8]* @_ZZ4mainE10lankGlyphs, i32 0, i32 0), i8* %18)
  ret i32 0
}

; Function Attrs: nounwind
declare void @llvm.memcpy.p0i8.p0i8.i32(i8* nocapture, i8* nocapture readonly, i32, i32, i1) #1

define internal i32 @_Z17lankGlyphToNibblec(i8 zeroext %glyph) #0 {
  %1 = alloca i8, align 1
  %result = alloca i32, align 4
  store i8 %glyph, i8* %1, align 1
  store i32 16, i32* %result, align 4
  %2 = load i8* %1, align 1
  %3 = zext i8 %2 to i32
  %4 = icmp sge i32 %3, 46
  br i1 %4, label %5, label %6

; <label>:5                                       ; preds = %0
  br label %8

; <label>:6                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([13 x i8]* @.str10, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 157, i8* getelementptr inbounds ([39 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphToNibblec, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %8

; <label>:8                                       ; preds = %7, %5
  %9 = load i8* %1, align 1
  %10 = zext i8 %9 to i32
  %11 = icmp sle i32 %10, 119
  br i1 %11, label %12, label %13

; <label>:12                                      ; preds = %8
  br label %15

; <label>:13                                      ; preds = %8
  call void @__assert_fail(i8* getelementptr inbounds ([13 x i8]* @.str11, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 158, i8* getelementptr inbounds ([39 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphToNibblec, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %15

; <label>:15                                      ; preds = %14, %12
  %16 = load i8* %1, align 1
  %17 = zext i8 %16 to i32
  switch i32 %17, label %34 [
    i32 46, label %18
    i32 109, label %19
    i32 107, label %20
    i32 105, label %21
    i32 97, label %22
    i32 121, label %23
    i32 117, label %24
    i32 112, label %25
    i32 119, label %26
    i32 110, label %27
    i32 115, label %28
    i32 116, label %29
    i32 108, label %30
    i32 104, label %31
    i32 102, label %32
    i32 99, label %33
  ]

; <label>:18                                      ; preds = %15
  store i32 0, i32* %result, align 4
  br label %35

; <label>:19                                      ; preds = %15
  store i32 1, i32* %result, align 4
  br label %35

; <label>:20                                      ; preds = %15
  store i32 2, i32* %result, align 4
  br label %35

; <label>:21                                      ; preds = %15
  store i32 3, i32* %result, align 4
  br label %35

; <label>:22                                      ; preds = %15
  store i32 4, i32* %result, align 4
  br label %35

; <label>:23                                      ; preds = %15
  store i32 5, i32* %result, align 4
  br label %35

; <label>:24                                      ; preds = %15
  store i32 6, i32* %result, align 4
  br label %35

; <label>:25                                      ; preds = %15
  store i32 7, i32* %result, align 4
  br label %35

; <label>:26                                      ; preds = %15
  store i32 10, i32* %result, align 4
  br label %35

; <label>:27                                      ; preds = %15
  store i32 9, i32* %result, align 4
  br label %35

; <label>:28                                      ; preds = %15
  store i32 10, i32* %result, align 4
  br label %35

; <label>:29                                      ; preds = %15
  store i32 11, i32* %result, align 4
  br label %35

; <label>:30                                      ; preds = %15
  store i32 12, i32* %result, align 4
  br label %35

; <label>:31                                      ; preds = %15
  store i32 13, i32* %result, align 4
  br label %35

; <label>:32                                      ; preds = %15
  store i32 14, i32* %result, align 4
  br label %35

; <label>:33                                      ; preds = %15
  store i32 15, i32* %result, align 4
  br label %35

; <label>:34                                      ; preds = %15
  call void @_Z5errorPKc(i8* getelementptr inbounds ([33 x i8]* @.str12, i32 0, i32 0))
  br label %35

; <label>:35                                      ; preds = %34, %33, %32, %31, %30, %29, %28, %27, %26, %25, %24, %23, %22, %21, %20, %19, %18
  %36 = load i32* %result, align 4
  %37 = icmp ule i32 %36, 15
  br i1 %37, label %38, label %39

; <label>:38                                      ; preds = %35
  br label %41

; <label>:39                                      ; preds = %35
  call void @__assert_fail(i8* getelementptr inbounds ([14 x i8]* @.str13, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 179, i8* getelementptr inbounds ([39 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphToNibblec, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %41

; <label>:41                                      ; preds = %40, %38
  %42 = load i32* %result, align 4
  ret i32 %42
}

define internal void @_Z17lankGlyphsToChar8iPKciPc(i32 %glyphsLength, i8* %glyphs, i32 %resultLength, i8* %result) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i8*, align 4
  %3 = alloca i32, align 4
  %4 = alloca i8*, align 4
  %i = alloca i32, align 4
  store i32 %glyphsLength, i32* %1, align 4
  store i8* %glyphs, i8** %2, align 4
  store i32 %resultLength, i32* %3, align 4
  store i8* %result, i8** %4, align 4
  store i32 0, i32* %i, align 4
  %5 = load i8** %2, align 4
  %6 = icmp ne i8* %5, null
  br i1 %6, label %7, label %8

; <label>:7                                       ; preds = %0
  br label %10

; <label>:8                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str7, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 197, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphsToChar8iPKciPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %10

; <label>:10                                      ; preds = %9, %7
  %11 = load i8** %4, align 4
  %12 = icmp ne i8* %11, null
  br i1 %12, label %13, label %14

; <label>:13                                      ; preds = %10
  br label %16

; <label>:14                                      ; preds = %10
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str8, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 198, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphsToChar8iPKciPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %16

; <label>:16                                      ; preds = %15, %13
  %17 = load i32* %3, align 4
  %18 = sub nsw i32 %17, 1
  %19 = load i32* %1, align 4
  %20 = sub nsw i32 %19, 1
  %21 = sdiv i32 %20, 2
  %22 = icmp eq i32 %18, %21
  br i1 %22, label %23, label %24

; <label>:23                                      ; preds = %16
  br label %26

; <label>:24                                      ; preds = %16
  call void @__assert_fail(i8* getelementptr inbounds ([37 x i8]* @.str9, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 199, i8* getelementptr inbounds ([67 x i8]* @__PRETTY_FUNCTION__._Z17lankGlyphsToChar8iPKciPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %26

; <label>:26                                      ; preds = %25, %23
  store i32 0, i32* %i, align 4
  br label %27

; <label>:27                                      ; preds = %52, %26
  %28 = load i32* %i, align 4
  %29 = load i32* %3, align 4
  %30 = sub nsw i32 %29, 1
  %31 = icmp slt i32 %28, %30
  br i1 %31, label %32, label %55

; <label>:32                                      ; preds = %27
  %33 = load i32* %i, align 4
  %34 = mul nsw i32 %33, 2
  %35 = load i8** %2, align 4
  %36 = getelementptr inbounds i8* %35, i32 %34
  %37 = load i8* %36, align 1
  %38 = call i32 @_Z17lankGlyphToNibblec(i8 zeroext %37)
  %39 = load i32* %i, align 4
  %40 = mul nsw i32 %39, 2
  %41 = add nsw i32 %40, 1
  %42 = load i8** %2, align 4
  %43 = getelementptr inbounds i8* %42, i32 %41
  %44 = load i8* %43, align 1
  %45 = call i32 @_Z17lankGlyphToNibblec(i8 zeroext %44)
  %46 = mul i32 %45, 16
  %47 = add i32 %38, %46
  %48 = trunc i32 %47 to i8
  %49 = load i32* %i, align 4
  %50 = load i8** %4, align 4
  %51 = getelementptr inbounds i8* %50, i32 %49
  store i8 %48, i8* %51, align 1
  br label %52

; <label>:52                                      ; preds = %32
  %53 = load i32* %i, align 4
  %54 = add nsw i32 %53, 1
  store i32 %54, i32* %i, align 4
  br label %27

; <label>:55                                      ; preds = %27
  %56 = load i32* %3, align 4
  %57 = sub nsw i32 %56, 1
  %58 = load i8** %4, align 4
  %59 = getelementptr inbounds i8* %58, i32 %57
  store i8 0, i8* %59, align 1
  ret void
}

define internal void @_Z5errorPKc(i8* %message) #0 {
  %1 = alloca i8*, align 4
  store i8* %message, i8** %1, align 4
  %2 = load %struct._IO_FILE** @stderr, align 4
  %3 = load i8** %1, align 4
  %4 = call i32 (%struct._IO_FILE*, i8*, ...)* @fprintf(%struct._IO_FILE* %2, i8* getelementptr inbounds ([4 x i8]* @.str3, i32 0, i32 0), i8* %3)
  call void @exit(i32 1) #4
  unreachable
                                                  ; No predecessors!
  ret void
}

declare i32 @fprintf(%struct._IO_FILE*, i8*, ...) #0

; Function Attrs: noreturn nounwind
declare void @exit(i32) #2

define internal void @_Z9printRegsPKj(i32* %memory) #0 {
  %1 = alloca i32*, align 4
  %printedLength = alloca i32, align 4
  store i32* %memory, i32** %1, align 4
  store i32 0, i32* %printedLength, align 4
  %2 = load i32** %1, align 4
  %3 = icmp ne i32* %2, null
  br i1 %3, label %4, label %5

; <label>:4                                       ; preds = %0
  br label %7

; <label>:5                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str22, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 308, i8* getelementptr inbounds ([33 x i8]* @__PRETTY_FUNCTION__._Z9printRegsPKj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %7

; <label>:7                                       ; preds = %6, %4
  %8 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([13 x i8]* @.str23, i32 0, i32 0))
  %9 = load i32* %printedLength, align 4
  %10 = add i32 %9, %8
  store i32 %10, i32* %printedLength, align 4
  %11 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([19 x i8]* @.str24, i32 0, i32 0))
  %12 = load i32* %printedLength, align 4
  %13 = add i32 %12, %11
  store i32 %13, i32* %printedLength, align 4
  %14 = load i32** %1, align 4
  %15 = getelementptr inbounds i32* %14, i32 0
  %16 = load i32* %15, align 4
  %17 = load i32** %1, align 4
  %18 = getelementptr inbounds i32* %17, i32 16
  %19 = load i32* %18, align 4
  %20 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str25, i32 0, i32 0), i32 %16, i32 %19)
  %21 = load i32* %printedLength, align 4
  %22 = add i32 %21, %20
  store i32 %22, i32* %printedLength, align 4
  %23 = load i32** %1, align 4
  %24 = getelementptr inbounds i32* %23, i32 1
  %25 = load i32* %24, align 4
  %26 = load i32** %1, align 4
  %27 = getelementptr inbounds i32* %26, i32 17
  %28 = load i32* %27, align 4
  %29 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str26, i32 0, i32 0), i32 %25, i32 %28)
  %30 = load i32* %printedLength, align 4
  %31 = add i32 %30, %29
  store i32 %31, i32* %printedLength, align 4
  %32 = load i32** %1, align 4
  %33 = getelementptr inbounds i32* %32, i32 2
  %34 = load i32* %33, align 4
  %35 = load i32** %1, align 4
  %36 = getelementptr inbounds i32* %35, i32 18
  %37 = load i32* %36, align 4
  %38 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str27, i32 0, i32 0), i32 %34, i32 %37)
  %39 = load i32* %printedLength, align 4
  %40 = add i32 %39, %38
  store i32 %40, i32* %printedLength, align 4
  %41 = load i32** %1, align 4
  %42 = getelementptr inbounds i32* %41, i32 3
  %43 = load i32* %42, align 4
  %44 = load i32** %1, align 4
  %45 = getelementptr inbounds i32* %44, i32 19
  %46 = load i32* %45, align 4
  %47 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str28, i32 0, i32 0), i32 %43, i32 %46)
  %48 = load i32* %printedLength, align 4
  %49 = add i32 %48, %47
  store i32 %49, i32* %printedLength, align 4
  %50 = load i32** %1, align 4
  %51 = getelementptr inbounds i32* %50, i32 4
  %52 = load i32* %51, align 4
  %53 = load i32** %1, align 4
  %54 = getelementptr inbounds i32* %53, i32 20
  %55 = load i32* %54, align 4
  %56 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str29, i32 0, i32 0), i32 %52, i32 %55)
  %57 = load i32* %printedLength, align 4
  %58 = add i32 %57, %56
  store i32 %58, i32* %printedLength, align 4
  %59 = load i32** %1, align 4
  %60 = getelementptr inbounds i32* %59, i32 5
  %61 = load i32* %60, align 4
  %62 = load i32** %1, align 4
  %63 = getelementptr inbounds i32* %62, i32 21
  %64 = load i32* %63, align 4
  %65 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str30, i32 0, i32 0), i32 %61, i32 %64)
  %66 = load i32* %printedLength, align 4
  %67 = add i32 %66, %65
  store i32 %67, i32* %printedLength, align 4
  %68 = load i32** %1, align 4
  %69 = getelementptr inbounds i32* %68, i32 6
  %70 = load i32* %69, align 4
  %71 = load i32** %1, align 4
  %72 = getelementptr inbounds i32* %71, i32 22
  %73 = load i32* %72, align 4
  %74 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str31, i32 0, i32 0), i32 %70, i32 %73)
  %75 = load i32* %printedLength, align 4
  %76 = add i32 %75, %74
  store i32 %76, i32* %printedLength, align 4
  %77 = load i32** %1, align 4
  %78 = getelementptr inbounds i32* %77, i32 7
  %79 = load i32* %78, align 4
  %80 = load i32** %1, align 4
  %81 = getelementptr inbounds i32* %80, i32 23
  %82 = load i32* %81, align 4
  %83 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str32, i32 0, i32 0), i32 %79, i32 %82)
  %84 = load i32* %printedLength, align 4
  %85 = add i32 %84, %83
  store i32 %85, i32* %printedLength, align 4
  %86 = load i32** %1, align 4
  %87 = getelementptr inbounds i32* %86, i32 8
  %88 = load i32* %87, align 4
  %89 = load i32** %1, align 4
  %90 = getelementptr inbounds i32* %89, i32 24
  %91 = load i32* %90, align 4
  %92 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str30, i32 0, i32 0), i32 %88, i32 %91)
  %93 = load i32* %printedLength, align 4
  %94 = add i32 %93, %92
  store i32 %94, i32* %printedLength, align 4
  %95 = load i32** %1, align 4
  %96 = getelementptr inbounds i32* %95, i32 9
  %97 = load i32* %96, align 4
  %98 = load i32** %1, align 4
  %99 = getelementptr inbounds i32* %98, i32 25
  %100 = load i32* %99, align 4
  %101 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str33, i32 0, i32 0), i32 %97, i32 %100)
  %102 = load i32* %printedLength, align 4
  %103 = add i32 %102, %101
  store i32 %103, i32* %printedLength, align 4
  %104 = load i32** %1, align 4
  %105 = getelementptr inbounds i32* %104, i32 9
  %106 = load i32* %105, align 4
  %107 = load i32** %1, align 4
  %108 = getelementptr inbounds i32* %107, i32 25
  %109 = load i32* %108, align 4
  %110 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str34, i32 0, i32 0), i32 %106, i32 %109)
  %111 = load i32* %printedLength, align 4
  %112 = add i32 %111, %110
  store i32 %112, i32* %printedLength, align 4
  %113 = load i32** %1, align 4
  %114 = getelementptr inbounds i32* %113, i32 11
  %115 = load i32* %114, align 4
  %116 = load i32** %1, align 4
  %117 = getelementptr inbounds i32* %116, i32 27
  %118 = load i32* %117, align 4
  %119 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str33, i32 0, i32 0), i32 %115, i32 %118)
  %120 = load i32* %printedLength, align 4
  %121 = add i32 %120, %119
  store i32 %121, i32* %printedLength, align 4
  %122 = load i32** %1, align 4
  %123 = getelementptr inbounds i32* %122, i32 12
  %124 = load i32* %123, align 4
  %125 = load i32** %1, align 4
  %126 = getelementptr inbounds i32* %125, i32 28
  %127 = load i32* %126, align 4
  %128 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str35, i32 0, i32 0), i32 %124, i32 %127)
  %129 = load i32* %printedLength, align 4
  %130 = add i32 %129, %128
  store i32 %130, i32* %printedLength, align 4
  %131 = load i32** %1, align 4
  %132 = getelementptr inbounds i32* %131, i32 14
  %133 = load i32* %132, align 4
  %134 = load i32** %1, align 4
  %135 = getelementptr inbounds i32* %134, i32 30
  %136 = load i32* %135, align 4
  %137 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str36, i32 0, i32 0), i32 %133, i32 %136)
  %138 = load i32* %printedLength, align 4
  %139 = add i32 %138, %137
  store i32 %139, i32* %printedLength, align 4
  %140 = load i32** %1, align 4
  %141 = getelementptr inbounds i32* %140, i32 15
  %142 = load i32* %141, align 4
  %143 = load i32** %1, align 4
  %144 = getelementptr inbounds i32* %143, i32 31
  %145 = load i32* %144, align 4
  %146 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([18 x i8]* @.str37, i32 0, i32 0), i32 %142, i32 %145)
  %147 = load i32* %printedLength, align 4
  %148 = add i32 %147, %146
  store i32 %148, i32* %printedLength, align 4
  %149 = load i32* %printedLength, align 4
  %150 = icmp ugt i32 %149, 0
  br i1 %150, label %151, label %152

; <label>:151                                     ; preds = %7
  br label %154

; <label>:152                                     ; preds = %7
  call void @__assert_fail(i8* getelementptr inbounds ([18 x i8]* @.str38, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 341, i8* getelementptr inbounds ([33 x i8]* @__PRETTY_FUNCTION__._Z9printRegsPKj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %154

; <label>:154                                     ; preds = %153, %151
  ret void
}

define internal void @_Z24EightNibblesToLankGlyphsjPc(i32 %intWord, i8* %result) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i8*, align 4
  %nibbles = alloca [8 x i32], align 4
  store i32 %intWord, i32* %1, align 4
  store i8* %result, i8** %2, align 4
  %3 = load i32* %1, align 4
  %4 = icmp ule i32 %3, -1
  br i1 %4, label %5, label %6

; <label>:5                                       ; preds = %0
  br label %8

; <label>:6                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([34 x i8]* @.str41, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 252, i8* getelementptr inbounds ([54 x i8]* @__PRETTY_FUNCTION__._Z24EightNibblesToLankGlyphsjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %8

; <label>:8                                       ; preds = %7, %5
  %9 = load i8** %2, align 4
  %10 = icmp ne i8* %9, null
  br i1 %10, label %11, label %12

; <label>:11                                      ; preds = %8
  br label %14

; <label>:12                                      ; preds = %8
  call void @__assert_fail(i8* getelementptr inbounds ([17 x i8]* @.str8, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 253, i8* getelementptr inbounds ([54 x i8]* @__PRETTY_FUNCTION__._Z24EightNibblesToLankGlyphsjPc, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %14

; <label>:14                                      ; preds = %13, %11
  %15 = load i8** %2, align 4
  %16 = getelementptr inbounds i8* %15, i32 8
  store i8 0, i8* %16, align 1
  %17 = load i32* %1, align 4
  %18 = and i32 %17, 15
  %19 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 0
  store i32 %18, i32* %19, align 4
  %20 = load i32* %1, align 4
  %21 = and i32 %20, 240
  %22 = lshr i32 %21, 4
  %23 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 1
  store i32 %22, i32* %23, align 4
  %24 = load i32* %1, align 4
  %25 = and i32 %24, 3840
  %26 = lshr i32 %25, 8
  %27 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 2
  store i32 %26, i32* %27, align 4
  %28 = load i32* %1, align 4
  %29 = and i32 %28, 61440
  %30 = lshr i32 %29, 12
  %31 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 3
  store i32 %30, i32* %31, align 4
  %32 = load i32* %1, align 4
  %33 = and i32 %32, 983040
  %34 = lshr i32 %33, 16
  %35 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 4
  store i32 %34, i32* %35, align 4
  %36 = load i32* %1, align 4
  %37 = and i32 %36, 15728640
  %38 = lshr i32 %37, 20
  %39 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 5
  store i32 %38, i32* %39, align 4
  %40 = load i32* %1, align 4
  %41 = and i32 %40, 251658240
  %42 = lshr i32 %41, 24
  %43 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 6
  store i32 %42, i32* %43, align 4
  %44 = load i32* %1, align 4
  %45 = and i32 %44, -268435456
  %46 = lshr i32 %45, 28
  %47 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 7
  store i32 %46, i32* %47, align 4
  %48 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 0
  %49 = load i32* %48, align 4
  %50 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %49)
  %51 = load i8** %2, align 4
  %52 = getelementptr inbounds i8* %51, i32 0
  store i8 %50, i8* %52, align 1
  %53 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 1
  %54 = load i32* %53, align 4
  %55 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %54)
  %56 = load i8** %2, align 4
  %57 = getelementptr inbounds i8* %56, i32 1
  store i8 %55, i8* %57, align 1
  %58 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 2
  %59 = load i32* %58, align 4
  %60 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %59)
  %61 = load i8** %2, align 4
  %62 = getelementptr inbounds i8* %61, i32 2
  store i8 %60, i8* %62, align 1
  %63 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 3
  %64 = load i32* %63, align 4
  %65 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %64)
  %66 = load i8** %2, align 4
  %67 = getelementptr inbounds i8* %66, i32 3
  store i8 %65, i8* %67, align 1
  %68 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 4
  %69 = load i32* %68, align 4
  %70 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %69)
  %71 = load i8** %2, align 4
  %72 = getelementptr inbounds i8* %71, i32 4
  store i8 %70, i8* %72, align 1
  %73 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 5
  %74 = load i32* %73, align 4
  %75 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %74)
  %76 = load i8** %2, align 4
  %77 = getelementptr inbounds i8* %76, i32 5
  store i8 %75, i8* %77, align 1
  %78 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 6
  %79 = load i32* %78, align 4
  %80 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %79)
  %81 = load i8** %2, align 4
  %82 = getelementptr inbounds i8* %81, i32 6
  store i8 %80, i8* %82, align 1
  %83 = getelementptr inbounds [8 x i32]* %nibbles, i32 0, i32 7
  %84 = load i32* %83, align 4
  %85 = call zeroext i8 @_Z17nibbleToLankGlyphj(i32 %84)
  %86 = load i8** %2, align 4
  %87 = getelementptr inbounds i8* %86, i32 7
  store i8 %85, i8* %87, align 1
  ret void
}

define internal zeroext i8 @_Z17nibbleToLankGlyphj(i32 %nibble) #0 {
  %1 = alloca i32, align 4
  %result = alloca i8, align 1
  store i32 %nibble, i32* %1, align 4
  store i8 88, i8* %result, align 1
  %2 = load i32* %1, align 4
  %3 = icmp ule i32 %2, 15
  br i1 %3, label %4, label %5

; <label>:4                                       ; preds = %0
  br label %7

; <label>:5                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([14 x i8]* @.str42, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 223, i8* getelementptr inbounds ([39 x i8]* @__PRETTY_FUNCTION__._Z17nibbleToLankGlyphj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %7

; <label>:7                                       ; preds = %6, %4
  %8 = load i32* %1, align 4
  switch i32 %8, label %25 [
    i32 0, label %9
    i32 1, label %10
    i32 2, label %11
    i32 3, label %12
    i32 4, label %13
    i32 5, label %14
    i32 6, label %15
    i32 7, label %16
    i32 8, label %17
    i32 9, label %18
    i32 10, label %19
    i32 11, label %20
    i32 12, label %21
    i32 13, label %22
    i32 14, label %23
    i32 15, label %24
  ]

; <label>:9                                       ; preds = %7
  store i8 109, i8* %result, align 1
  br label %26

; <label>:10                                      ; preds = %7
  store i8 107, i8* %result, align 1
  br label %26

; <label>:11                                      ; preds = %7
  store i8 105, i8* %result, align 1
  br label %26

; <label>:12                                      ; preds = %7
  store i8 97, i8* %result, align 1
  br label %26

; <label>:13                                      ; preds = %7
  store i8 121, i8* %result, align 1
  br label %26

; <label>:14                                      ; preds = %7
  store i8 117, i8* %result, align 1
  br label %26

; <label>:15                                      ; preds = %7
  store i8 112, i8* %result, align 1
  br label %26

; <label>:16                                      ; preds = %7
  store i8 119, i8* %result, align 1
  br label %26

; <label>:17                                      ; preds = %7
  store i8 110, i8* %result, align 1
  br label %26

; <label>:18                                      ; preds = %7
  store i8 115, i8* %result, align 1
  br label %26

; <label>:19                                      ; preds = %7
  store i8 116, i8* %result, align 1
  br label %26

; <label>:20                                      ; preds = %7
  store i8 108, i8* %result, align 1
  br label %26

; <label>:21                                      ; preds = %7
  store i8 104, i8* %result, align 1
  br label %26

; <label>:22                                      ; preds = %7
  store i8 102, i8* %result, align 1
  br label %26

; <label>:23                                      ; preds = %7
  store i8 46, i8* %result, align 1
  br label %26

; <label>:24                                      ; preds = %7
  store i8 99, i8* %result, align 1
  br label %26

; <label>:25                                      ; preds = %7
  call void @_Z5errorPKc(i8* getelementptr inbounds ([34 x i8]* @.str43, i32 0, i32 0))
  br label %26

; <label>:26                                      ; preds = %25, %24, %23, %22, %21, %20, %19, %18, %17, %16, %15, %14, %13, %12, %11, %10, %9
  %27 = load i8* %result, align 1
  %28 = zext i8 %27 to i32
  %29 = icmp sge i32 %28, 46
  br i1 %29, label %30, label %35

; <label>:30                                      ; preds = %26
  %31 = load i8* %result, align 1
  %32 = zext i8 %31 to i32
  %33 = icmp sle i32 %32, 122
  br i1 %33, label %34, label %35

; <label>:34                                      ; preds = %30
  br label %37

; <label>:35                                      ; preds = %30, %26
  call void @__assert_fail(i8* getelementptr inbounds ([30 x i8]* @.str44, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 244, i8* getelementptr inbounds ([39 x i8]* @__PRETTY_FUNCTION__._Z17nibbleToLankGlyphj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %37

; <label>:37                                      ; preds = %36, %34
  %38 = load i8* %result, align 1
  ret i8 %38
}

define internal void @_Z12phraseDecodejtPj(i32 %phraseWord, i16 zeroext %typeWord, i32* %memory) #0 {
  %1 = alloca i32, align 4
  %2 = alloca i16, align 2
  %3 = alloca i32*, align 4
  store i32 %phraseWord, i32* %1, align 4
  store i16 %typeWord, i16* %2, align 2
  store i32* %memory, i32** %3, align 4
  %4 = load i32* %1, align 4
  %5 = icmp ne i32 %4, 0
  br i1 %5, label %6, label %40

; <label>:6                                       ; preds = %0
  %7 = load i32* %1, align 4
  switch i32 %7, label %38 [
    i32 60, label %8
    i32 58, label %18
    i32 89, label %28
  ]

; <label>:8                                       ; preds = %6
  %9 = load i32** %3, align 4
  %10 = getelementptr inbounds i32* %9, i32 0
  %11 = load i32* %10, align 4
  %12 = load i32** %3, align 4
  %13 = getelementptr inbounds i32* %12, i32 10
  store i32 %11, i32* %13, align 4
  %14 = load i16* %2, align 2
  %15 = zext i16 %14 to i32
  %16 = load i32** %3, align 4
  %17 = getelementptr inbounds i32* %16, i32 26
  store i32 %15, i32* %17, align 4
  br label %39

; <label>:18                                      ; preds = %6
  %19 = load i32** %3, align 4
  %20 = getelementptr inbounds i32* %19, i32 0
  %21 = load i32* %20, align 4
  %22 = load i32** %3, align 4
  %23 = getelementptr inbounds i32* %22, i32 5
  store i32 %21, i32* %23, align 4
  %24 = load i16* %2, align 2
  %25 = zext i16 %24 to i32
  %26 = load i32** %3, align 4
  %27 = getelementptr inbounds i32* %26, i32 21
  store i32 %25, i32* %27, align 4
  br label %39

; <label>:28                                      ; preds = %6
  %29 = load i32** %3, align 4
  %30 = getelementptr inbounds i32* %29, i32 0
  %31 = load i32* %30, align 4
  %32 = load i32** %3, align 4
  %33 = getelementptr inbounds i32* %32, i32 6
  store i32 %31, i32* %33, align 4
  %34 = load i16* %2, align 2
  %35 = zext i16 %34 to i32
  %36 = load i32** %3, align 4
  %37 = getelementptr inbounds i32* %36, i32 22
  store i32 %35, i32* %37, align 4
  br label %39

; <label>:38                                      ; preds = %6
  call void @_Z5errorPKc(i8* getelementptr inbounds ([33 x i8]* @.str50, i32 0, i32 0))
  br label %39

; <label>:39                                      ; preds = %38, %28, %18, %8
  br label %40

; <label>:40                                      ; preds = %39, %0
  ret void
}

; Function Attrs: nounwind
define internal i32 @_Z16amountOfSameBitsjj(i32 %number, i32 %maxLength) #3 {
  %1 = alloca i32, align 4
  %2 = alloca i32, align 4
  %length = alloca i32, align 4
  %i = alloca i32, align 4
  %firstBit = alloca i32, align 4
  %workNum = alloca i32, align 4
  store i32 %number, i32* %1, align 4
  store i32 %maxLength, i32* %2, align 4
  store i32 0, i32* %length, align 4
  %3 = load i32* %1, align 4
  store i32 %3, i32* %workNum, align 4
  %4 = load i32* %1, align 4
  %5 = icmp ult i32 %4, -1
  br i1 %5, label %6, label %7

; <label>:6                                       ; preds = %0
  br label %9

; <label>:7                                       ; preds = %0
  call void @__assert_fail(i8* getelementptr inbounds ([32 x i8]* @.str59, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 84, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %9

; <label>:9                                       ; preds = %8, %6
  %10 = load i32* %2, align 4
  %11 = icmp ule i32 %10, 32
  br i1 %11, label %12, label %13

; <label>:12                                      ; preds = %9
  br label %15

; <label>:13                                      ; preds = %9
  call void @__assert_fail(i8* getelementptr inbounds ([38 x i8]* @.str60, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 85, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %15

; <label>:15                                      ; preds = %14, %12
  %16 = load i32* %workNum, align 4
  %17 = and i32 %16, 1
  store i32 %17, i32* %firstBit, align 4
  %18 = load i32* %firstBit, align 4
  %19 = icmp ule i32 %18, 1
  br i1 %19, label %20, label %21

; <label>:20                                      ; preds = %15
  br label %23

; <label>:21                                      ; preds = %15
  call void @__assert_fail(i8* getelementptr inbounds ([25 x i8]* @.str61, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 87, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %23

; <label>:23                                      ; preds = %22, %20
  store i32 0, i32* %i, align 4
  br label %24

; <label>:24                                      ; preds = %40, %23
  %25 = load i32* %i, align 4
  %26 = load i32* %2, align 4
  %27 = icmp ult i32 %25, %26
  br i1 %27, label %28, label %43

; <label>:28                                      ; preds = %24
  %29 = load i32* %workNum, align 4
  %30 = and i32 %29, 1
  %31 = load i32* %firstBit, align 4
  %32 = icmp eq i32 %30, %31
  br i1 %32, label %33, label %38

; <label>:33                                      ; preds = %28
  %34 = load i32* %length, align 4
  %35 = add i32 %34, 1
  store i32 %35, i32* %length, align 4
  %36 = load i32* %workNum, align 4
  %37 = lshr i32 %36, 1
  store i32 %37, i32* %workNum, align 4
  br label %39

; <label>:38                                      ; preds = %28
  br label %43

; <label>:39                                      ; preds = %33
  br label %40

; <label>:40                                      ; preds = %39
  %41 = load i32* %i, align 4
  %42 = add i32 %41, 1
  store i32 %42, i32* %i, align 4
  br label %24

; <label>:43                                      ; preds = %38, %24
  %44 = load i32* %length, align 4
  %45 = load i32* %2, align 4
  %46 = icmp ule i32 %44, %45
  br i1 %46, label %47, label %48

; <label>:47                                      ; preds = %43
  br label %50

; <label>:48                                      ; preds = %43
  call void @__assert_fail(i8* getelementptr inbounds ([20 x i8]* @.str62, i32 0, i32 0), i8* getelementptr inbounds ([12 x i8]* @.str1, i32 0, i32 0), i32 96, i8* getelementptr inbounds ([58 x i8]* @__PRETTY_FUNCTION__._Z16amountOfSameBitsjj, i32 0, i32 0)) #4
  unreachable
                                                  ; No predecessors!
  br label %50

; <label>:50                                      ; preds = %49, %47
  %51 = load i32* %length, align 4
  ret i32 %51
}

attributes #0 = { "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { nounwind }
attributes #2 = { noreturn nounwind "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #3 = { nounwind "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf" "no-infs-fp-math"="false" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #4 = { noreturn nounwind }

!llvm.ident = !{!0}

!0 = metadata !{metadata !"Ubuntu clang version 3.4-1ubuntu3 (tags/RELEASE_34/final) (based on LLVM 3.4)"}
