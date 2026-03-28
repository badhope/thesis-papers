const MilitaryBases = [
    { name: '关岛安德森空军基地', country: '美国', type: 'airforce', lat: 13.5847, lng: 144.9294, importance: 'critical' },
    { name: '珍珠港海军基地', country: '美国', type: 'navy', lat: 21.3484, lng: -157.9724, importance: 'critical' },
    { name: '圣地亚哥海军基地', country: '美国', type: 'navy', lat: 32.6744, lng: -117.1178, importance: 'high' },
    { name: '诺福克海军基地', country: '美国', type: 'navy', lat: 36.9187, lng: -76.3175, importance: 'critical' },
    { name: '五角大楼', country: '美国', type: 'command', lat: 38.8719, lng: -77.0563, importance: 'critical' },
    { name: '怀特曼空军基地', country: '美国', type: 'airforce', lat: 38.7322, lng: -93.5531, importance: 'high' },
    { name: '迈诺特空军基地', country: '美国', type: 'airforce', lat: 48.4167, lng: -101.3500, importance: 'high' },
    { name: '马姆斯特罗姆空军基地', country: '美国', type: 'airforce', lat: 47.5050, lng: -111.1833, importance: 'high' },
    { name: '范登堡太空军基地', country: '美国', type: 'space', lat: 34.7420, lng: -120.5725, importance: 'high' },
    { name: '拉姆施泰因空军基地', country: '美国', type: 'airforce', lat: 49.4376, lng: 7.6005, importance: 'critical' },
    { name: '横须贺海军基地', country: '美国', type: 'navy', lat: 35.2833, lng: 139.6667, importance: 'critical' },
    { name: '嘉手纳空军基地', country: '美国', type: 'airforce', lat: 26.3578, lng: 127.7633, importance: 'critical' },
    { name: '乌山空军基地', country: '美国', type: 'airforce', lat: 37.0894, lng: 127.0333, importance: 'high' },
    { name: '迪戈加西亚海军基地', country: '美国', type: 'navy', lat: -7.3117, lng: 72.4167, importance: 'high' },
    { name: '因吉利克空军基地', country: '美国', type: 'airforce', lat: 37.0000, lng: 35.4167, importance: 'high' },
    
    { name: '俄罗斯国防部', country: '俄罗斯', type: 'command', lat: 55.7522, lng: 37.6156, importance: 'critical' },
    { name: '北方舰队司令部', country: '俄罗斯', type: 'navy', lat: 69.0167, lng: 33.0833, importance: 'critical' },
    { name: '太平洋舰队司令部', country: '俄罗斯', type: 'navy', lat: 43.1167, lng: 131.9000, importance: 'critical' },
    { name: '恩格斯空军基地', country: '俄罗斯', type: 'airforce', lat: 51.4833, lng: 46.2167, importance: 'high' },
    { name: '奥列尼亚空军基地', country: '俄罗斯', type: 'airforce', lat: 68.1500, lng: 33.3000, importance: 'high' },
    { name: '乌克兰卡空军基地', country: '俄罗斯', type: 'airforce', lat: 51.8167, lng: 128.4500, importance: 'high' },
    { name: '季克西空军基地', country: '俄罗斯', type: 'airforce', lat: 71.6333, lng: 128.9000, importance: 'medium' },
    { name: '堪察加彼得罗巴甫洛夫斯克潜艇基地', country: '俄罗斯', type: 'navy', lat: 53.0167, lng: 158.6500, importance: 'critical' },
    { name: '塞韦罗摩尔斯克海军基地', country: '俄罗斯', type: 'navy', lat: 69.0833, lng: 33.4167, importance: 'critical' },
    
    { name: '中央军委', country: '中国', type: 'command', lat: 39.9042, lng: 116.4074, importance: 'critical' },
    { name: '北海舰队司令部', country: '中国', type: 'navy', lat: 36.0671, lng: 120.3826, importance: 'critical' },
    { name: '东海舰队司令部', country: '中国', type: 'navy', lat: 29.8683, lng: 121.5440, importance: 'critical' },
    { name: '南海舰队司令部', country: '中国', type: 'navy', lat: 21.2708, lng: 110.3575, importance: 'critical' },
    { name: '火箭军司令部', country: '中国', type: 'missile', lat: 39.9042, lng: 116.4074, importance: 'critical' },
    { name: '三亚海军基地', country: '中国', type: 'navy', lat: 18.2500, lng: 109.5000, importance: 'high' },
    { name: '葫芦岛潜艇基地', country: '中国', type: 'navy', lat: 40.7500, lng: 120.8500, importance: 'high' },
    { name: '酒泉卫星发射中心', country: '中国', type: 'space', lat: 40.9583, lng: 100.2917, importance: 'high' },
    { name: '西昌卫星发射中心', country: '中国', type: 'space', lat: 28.2467, lng: 102.0267, importance: 'high' },
    { name: '文昌航天发射场', country: '中国', type: 'space', lat: 19.6144, lng: 110.9511, importance: 'high' },
    
    { name: '国防部', country: '英国', type: 'command', lat: 51.4980, lng: -0.1398, importance: 'critical' },
    { name: '克莱德海军基地', country: '英国', type: 'navy', lat: 55.9333, lng: -4.9333, importance: 'critical' },
    { name: '费尔福德空军基地', country: '英国', type: 'airforce', lat: 51.6822, lng: -1.6697, importance: 'high' },
    { name: '米尔登霍尔皇家空军基地', country: '英国', type: 'airforce', lat: 52.3617, lng: 0.4864, importance: 'high' },
    
    { name: '国防部', country: '法国', type: 'command', lat: 48.8566, lng: 2.3522, importance: 'critical' },
    { name: '布雷斯特海军基地', country: '法国', type: 'navy', lat: 48.3833, lng: -4.5000, importance: 'high' },
    { name: '土伦海军基地', country: '法国', type: 'navy', lat: 43.1167, lng: 5.9333, importance: 'high' },
    { name: '阿沃德空军基地', country: '法国', type: 'airforce', lat: 47.0500, lng: 2.3667, importance: 'high' },
    
    { name: '国防部', country: '印度', type: 'command', lat: 28.6139, lng: 77.2090, importance: 'critical' },
    { name: '西部海军司令部', country: '印度', type: 'navy', lat: 18.9750, lng: 72.8258, importance: 'high' },
    { name: '东部海军司令部', country: '印度', type: 'navy', lat: 17.7231, lng: 83.3013, importance: 'high' },
    { name: '安达曼尼科巴司令部', country: '印度', type: 'navy', lat: 11.6667, lng: 92.7500, importance: 'high' },
    { name: '战略部队司令部', country: '印度', type: 'missile', lat: 28.6139, lng: 77.2090, importance: 'critical' },
    
    { name: '国防部', country: '日本', type: 'command', lat: 35.6828, lng: 139.7594, importance: 'critical' },
    { name: '横须贺海军基地', country: '日本', type: 'navy', lat: 35.2833, lng: 139.6667, importance: 'critical' },
    { name: '佐世保海军基地', country: '日本', type: 'navy', lat: 33.1500, lng: 129.7167, importance: 'high' },
    { name: '舞鹤海军基地', country: '日本', type: 'navy', lat: 35.4833, lng: 135.3667, importance: 'medium' },
    { name: '吴港海军基地', country: '日本', type: 'navy', lat: 34.2333, lng: 132.5500, importance: 'medium' },
    
    { name: '国防部', country: '韩国', type: 'command', lat: 37.5665, lng: 126.9780, importance: 'critical' },
    { name: '镇海海军基地', country: '韩国', type: 'navy', lat: 35.1500, lng: 128.6000, importance: 'high' },
    { name: '釜山海军基地', country: '韩国', type: 'navy', lat: 35.1000, lng: 129.0333, importance: 'high' },
    { name: '乌山空军基地', country: '韩国', type: 'airforce', lat: 37.0894, lng: 127.0333, importance: 'high' },
    { name: '群山空军基地', country: '韩国', type: 'airforce', lat: 35.9033, lng: 126.6200, importance: 'high' },
    
    { name: '国防部', country: '朝鲜', type: 'command', lat: 39.0392, lng: 125.7625, importance: 'critical' },
    { name: '南浦海军基地', country: '朝鲜', type: 'navy', lat: 38.7333, lng: 125.4000, importance: 'high' },
    { name: '元山海军基地', country: '朝鲜', type: 'navy', lat: 39.1500, lng: 127.4500, importance: 'medium' },
    { name: '舞水端里导弹发射场', country: '朝鲜', type: 'missile', lat: 40.8500, lng: 129.6667, importance: 'critical' },
    { name: '西海卫星发射场', country: '朝鲜', type: 'space', lat: 39.6500, lng: 124.7000, importance: 'high' },
    
    { name: '国防部', country: '巴基斯坦', type: 'command', lat: 33.6844, lng: 73.0479, importance: 'critical' },
    { name: '卡拉奇海军基地', country: '巴基斯坦', type: 'navy', lat: 24.8500, lng: 67.0000, importance: 'high' },
    { name: '战略计划司', country: '巴基斯坦', type: 'missile', lat: 33.6844, lng: 73.0479, importance: 'critical' },
    
    { name: '国防部', country: '以色列', type: 'command', lat: 31.7683, lng: 35.2137, importance: 'critical' },
    { name: '海法海军基地', country: '以色列', type: 'navy', lat: 32.8167, lng: 34.9833, importance: 'high' },
    { name: '特拉维夫空军基地', country: '以色列', type: 'airforce', lat: 32.0055, lng: 34.8854, importance: 'high' },
    { name: '迪莫纳核研究中心', country: '以色列', type: 'nuclear', lat: 30.8500, lng: 35.0333, importance: 'critical' },
    
    { name: '国防部', country: '伊朗', type: 'command', lat: 35.6892, lng: 51.3890, importance: 'critical' },
    { name: '阿巴斯港海军基地', country: '伊朗', type: 'navy', lat: 27.1833, lng: 56.2667, importance: 'high' },
    { name: '布什尔核电站', country: '伊朗', type: 'nuclear', lat: 28.8333, lng: 50.8833, importance: 'critical' },
    { name: '纳坦兹核设施', country: '伊朗', type: 'nuclear', lat: 33.7167, lng: 51.7333, importance: 'critical' },
    
    { name: '国防部', country: '土耳其', type: 'command', lat: 39.9334, lng: 32.8597, importance: 'critical' },
    { name: '因吉利克空军基地', country: '土耳其', type: 'airforce', lat: 37.0000, lng: 35.4167, importance: 'high' },
    { name: '伊斯肯德伦海军基地', country: '土耳其', type: 'navy', lat: 36.5833, lng: 36.1667, importance: 'medium' },
    
    { name: '国防部', country: '沙特阿拉伯', type: 'command', lat: 24.7136, lng: 46.6753, importance: 'critical' },
    { name: '朱拜勒海军基地', country: '沙特阿拉伯', type: 'navy', lat: 27.0167, lng: 49.6167, importance: 'high' },
    { name: '宰赫兰空军基地', country: '沙特阿拉伯', type: 'airforce', lat: 26.2833, lng: 50.1500, importance: 'high' },
    
    { name: '国防部', country: '澳大利亚', type: 'command', lat: -35.2809, lng: 149.1300, importance: 'critical' },
    { name: '悉尼海军基地', country: '澳大利亚', type: 'navy', lat: -33.8500, lng: 151.2333, importance: 'high' },
    { name: '斯特林海军基地', country: '澳大利亚', type: 'navy', lat: -32.2167, lng: 115.7667, importance: 'high' },
    { name: '松峡联合防御设施', country: '澳大利亚', type: 'space', lat: -23.8000, lng: 133.8000, importance: 'critical' },
    
    { name: '国防部', country: '德国', type: 'command', lat: 52.5200, lng: 13.4050, importance: 'critical' },
    { name: '拉姆施泰因空军基地', country: '德国', type: 'airforce', lat: 49.4376, lng: 7.6005, importance: 'critical' },
    { name: '斯潘达勒姆空军基地', country: '德国', type: 'airforce', lat: 49.9667, lng: 7.3500, importance: 'high' },
    
    { name: '国防部', country: '意大利', type: 'command', lat: 41.9028, lng: 12.4964, importance: 'critical' },
    { name: '那不勒斯海军基地', country: '意大利', type: 'navy', lat: 40.8500, lng: 14.2667, importance: 'high' },
    { name: '阿维亚诺空军基地', country: '意大利', type: 'airforce', lat: 46.0333, lng: 12.6000, importance: 'high' },
    { name: '西戈内拉海军航空站', country: '意大利', type: 'navy', lat: 37.4000, lng: 14.9167, importance: 'high' },
    
    { name: '国防部', country: '埃及', type: 'command', lat: 30.0444, lng: 31.2357, importance: 'critical' },
    { name: '亚历山大海军基地', country: '埃及', type: 'navy', lat: 31.2000, lng: 29.9167, importance: 'high' },
    
    { name: '国防部', country: '巴西', type: 'command', lat: -15.7942, lng: -47.8822, importance: 'critical' },
    { name: '里约热内卢海军基地', country: '巴西', type: 'navy', lat: -22.9000, lng: -43.2333, importance: 'high' },
    { name: '阿尔坎塔拉发射中心', country: '巴西', type: 'space', lat: -2.3333, lng: -44.4000, importance: 'high' }
];

window.MilitaryBases = MilitaryBases;
