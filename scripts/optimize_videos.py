#!/usr/bin/env python3
"""
视频优化脚本 - 将视频文件压缩到适合GitHub Pages的大小
"""

import os
import subprocess
import sys
from pathlib import Path

def check_ffmpeg():
    """检查是否安装了ffmpeg"""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def optimize_video(input_path, output_path, target_size_mb=15):
    """
    优化视频文件到指定大小
    """
    if not check_ffmpeg():
        print("错误：需要安装ffmpeg才能使用此脚本")
        print("请访问 https://ffmpeg.org/download.html 下载安装")
        return False
    
    # 计算目标比特率 (kbps)
    # 假设视频时长约3分钟，目标15MB
    target_bitrate = (target_size_mb * 8 * 1024) // 180  # 3分钟 = 180秒
    
    cmd = [
        'ffmpeg',
        '-i', str(input_path),
        '-c:v', 'libx264',
        '-crf', '28',  # 较高的压缩率
        '-preset', 'fast',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',  # 优化网络播放
        '-y',  # 覆盖输出文件
        str(output_path)
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ 优化完成: {input_path.name} -> {output_path.name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 优化失败: {input_path.name}")
        print(f"错误信息: {e.stderr.decode()}")
        return False

def main():
    videos_dir = Path("static/videos")
    optimized_dir = Path("static/videos/optimized")
    
    # 创建优化后的视频目录
    optimized_dir.mkdir(exist_ok=True)
    
    # 需要优化的视频文件（大于20MB的）
    large_videos = [
        "both-of-us-were-forgotton.mp4",
        "youraisemeup-720p.mp4", 
        "wedding3.mp4",
        "wedding4.mp4"
    ]
    
    print("🎬 开始优化视频文件...")
    print("=" * 50)
    
    for video_name in large_videos:
        input_path = videos_dir / video_name
        output_path = optimized_dir / f"optimized_{video_name}"
        
        if input_path.exists():
            print(f"正在优化: {video_name}")
            success = optimize_video(input_path, output_path)
            if success:
                # 显示文件大小对比
                original_size = input_path.stat().st_size / (1024 * 1024)
                optimized_size = output_path.stat().st_size / (1024 * 1024)
                print(f"   原始大小: {original_size:.2f}MB")
                print(f"   优化后: {optimized_size:.2f}MB")
                print(f"   压缩率: {((original_size - optimized_size) / original_size * 100):.1f}%")
        else:
            print(f"⚠️  文件不存在: {video_name}")
    
    print("=" * 50)
    print("✅ 视频优化完成！")
    print("\n📝 下一步操作：")
    print("1. 检查 optimized/ 目录中的文件")
    print("2. 如果满意，替换原文件")
    print("3. 更新HTML中的视频路径")

if __name__ == "__main__":
    main()
