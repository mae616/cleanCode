// ユーザーデータの永続化を担当するリポジトリクラス
class UserRepository {
    constructor() {
        // 初期データをセット
        this.users = new Map([
            [
                "user1",
                {
                    id: "user1",
                    userName: "Eric",
                    password: "password1",
                },
            ],
            [
                "user2",
                {
                    id: "user2",
                    userName: "Alice",
                    password: "password2",
                },
            ],
        ]);
    }

    getUserName(userId) {
        return this.users.get(userId).userName;
    }
}

// ユーザー関連の処理
class User {
    constructor(userRepository, userId) {
        this.userRepository = userRepository;
        this.id = userId;
        this.userName = userRepository.getUserName(userId);
    }
}

// 投稿に関する処理
class Post {
    constructor(user, title, content) {
        this.userId = user.id;
        this.title = title;
        this.content = content;
        this.likes = 0;
        this.comments = [];
        this.createdAt = new Date();
    }

    addComment(comment, commentedUser) {
        this.comments.push({
            comment,
            userId: commentedUser.id,
            userName: commentedUser.userName,
        });
    }

    addLike() {
        this.likes++;
    }
}

// 通知関連の処理
class PostNotification {
    constructor(post, user) {
        this.post = post;
        this.user = user;
    }

    sendAddPostNotification() {
        const notification = {
            userId: this.post.userId,
            userName: this.user.userName,
            title: this.post.title,
            message: "新しい投稿が作成されました",
            createdAt: this.post.createdAt,
        };
        return notification;
    }
}

// 分析関連の処理
class AnalyticsService {
    trackPostMetrics(post) {
        const analytics = {
            event: "post_created",
            userId: post.userId,
            timestamp: post.createdAt,
        };
        return analytics;
    }
}
// 使用例
const user = new User(new UserRepository(), "user1");
const post = new Post(user, "title1", "content1");
const notification = new PostNotification(post, user);
console.log(notification.sendAddPostNotification());
