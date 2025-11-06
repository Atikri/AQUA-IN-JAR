// 点赞功能配置文件
// 请将下面的值替换为你从 Supabase 获取的实际值
// 
// 获取方式：
// 1. 登录 Supabase: https://supabase.com
// 2. 进入你的项目
// 3. Settings > API
// 4. 复制 Project URL 和 anon/public key

window.LIKE_CONFIG = {
  // Supabase 项目 URL (例如: https://xxxxx.supabase.co)
  supabaseUrl: 'https://igjkrqkdbvjcoxjnsfob.supabase.co',
  
  // Supabase anon/public key
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamtycWtkYnZqY294am5zZm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTM1MDUsImV4cCI6MjA3Nzk2OTUwNX0.HcOJAExb89GxxC7LRO-64DdjPm2yaRPhtkmf33hJMPw'
};

// 如果配置为空，使用 localStorage 作为后备方案
if (!window.LIKE_CONFIG.supabaseUrl || !window.LIKE_CONFIG.supabaseKey) {
  console.warn('点赞功能：Supabase 未配置，将使用本地存储模式');
}

