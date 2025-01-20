const users = [
    {
        id: "user1",
        userName: "Eric",
        password: "password1",
    },
    {
        id: "user2",
        userName: "Alice",
        password: "password2",
    },
];

class UserPost {
    constructor(userId, title, content) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.likes = 0;
        this.comments = [];
        this.createdAt = new Date();
    }

    // 投稿に関する処理
    addComment(comment, userId) {
        this.comments.push({ comment, userId });
    }

    addLike() {
        this.likes++;
    }

    // ユーザー関連の処理（本来はUserクラスにあるべき）
    getUserName() {
        return users.find((user) => user.id === this.userId).userName;
    }

    // 通知関連の処理（本来はNotificationクラスにあるべき）
    sendAddPostNotification() {
        const notification = {
            userId: this.userId,
            userName: this.getUserName(),
            message: "新しい投稿が作成されました",
            createdAt: new Date(),
        };
        return notification;
    }

    // 分析関連の処理（本来はAnalyticsクラスにあるべき）
    trackPostMetrics() {
        const analytics = {
            event: "post_created",
            userId: this.userId,
            timestamp: this.createdAt,
        };
        return analytics;
    }
}

// 使用例
const userPost = new UserPost("user1", "title1", "content1");
const notification = userPost.sendAddPostNotification();
console.log(notification);
