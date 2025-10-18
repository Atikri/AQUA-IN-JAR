# PowerShell脚本：压缩视频文件
# 需要安装FFmpeg

param(
    [string]$InputDir = "static\videos",
    [string]$OutputDir = "static\videos\compressed",
    [int]$TargetSizeMB = 10
)

# 检查FFmpeg是否安装
try {
    ffmpeg -version | Out-Null
    Write-Host "✅ FFmpeg已安装" -ForegroundColor Green
} catch {
    Write-Host "❌ 请先安装FFmpeg" -ForegroundColor Red
    Write-Host "下载地址: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    exit 1
}

# 创建输出目录
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
    Write-Host "📁 创建输出目录: $OutputDir" -ForegroundColor Blue
}

# 需要压缩的视频文件（大于15MB的）
$largeVideos = @(
    "both-of-us-were-forgotton.mp4",
    "youraisemeup-720p.mp4",
    "wedding3.mp4",
    "wedding4.mp4",
    "wallpaper.mp4"
)

Write-Host "🎬 开始压缩视频文件..." -ForegroundColor Cyan
Write-Host "=" * 50

foreach ($video in $largeVideos) {
    $inputPath = Join-Path $InputDir $video
    $outputPath = Join-Path $OutputDir $video
    
    if (Test-Path $inputPath) {
        $originalSize = (Get-Item $inputPath).Length / 1MB
        Write-Host "📹 正在压缩: $video (原始大小: $([math]::Round($originalSize, 2))MB)" -ForegroundColor Yellow
        
        # FFmpeg压缩命令
        $ffmpegCmd = @(
            "-i", $inputPath,
            "-c:v", "libx264",
            "-crf", "30",  # 更高的压缩率
            "-preset", "fast",
            "-c:a", "aac",
            "-b:a", "96k",  # 降低音频比特率
            "-movflags", "+faststart",  # 优化网络播放
            "-y",  # 覆盖输出文件
            $outputPath
        )
        
        try {
            & ffmpeg @ffmpegCmd 2>$null
            $compressedSize = (Get-Item $outputPath).Length / 1MB
            $compressionRatio = [math]::Round((($originalSize - $compressedSize) / $originalSize) * 100, 1)
            
            Write-Host "✅ 压缩完成: $video" -ForegroundColor Green
            Write-Host "   原始: $([math]::Round($originalSize, 2))MB → 压缩后: $([math]::Round($compressedSize, 2))MB" -ForegroundColor White
            Write-Host "   压缩率: $compressionRatio%" -ForegroundColor White
            Write-Host ""
        } catch {
            Write-Host "❌ 压缩失败: $video" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  文件不存在: $video" -ForegroundColor Yellow
    }
}

Write-Host "=" * 50
Write-Host "✅ 视频压缩完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步操作：" -ForegroundColor Cyan
Write-Host "1. 检查 $OutputDir 目录中的压缩文件" -ForegroundColor White
Write-Host "2. 如果满意，替换原文件或更新HTML路径" -ForegroundColor White
Write-Host "3. 提交更改并推送到GitHub" -ForegroundColor White
