import praw
import datetime

class PrawWrapper:
    def __init__(self, site_name, user_agent):
      self.reddit = praw.Reddit(site_name=site_name, user_agent=user_agent)

    def get_posts(self, subreddit, limit=10, start_date=None, end_date=None):
      self.subreddit = self.reddit.subreddit(subreddit)
      top_posts = self.subreddit.top(time_filter='all', limit=None)
      
      if start_date:
        start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
        top_posts = filter(lambda post: datetime.datetime.fromtimestamp(post.created_utc) >= start_date, top_posts)
        
      if end_date:
        end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
        if start_date and end_date < start_date:
          raise ValueError("End date must be after start date")
        
        top_posts = filter(lambda post: datetime.datetime.fromtimestamp(post.created_utc) <= end_date, top_posts)
        
      
      to_return = []
      
      for post in top_posts:
        comments = list(self.__get_comments(post.id))
        post_object = {
          "title": post.title,
          "selftext": post.selftext,
          "url": f"https://www.reddit.com{post.permalink}",
          "created_utc": post.created_utc * 1000,
          "comments": sorted(comments)
        }
          
        to_return.append(post_object)
    
      to_return = sorted(to_return, key=lambda x: x["created_utc"], reverse=True)
      return to_return
    
    
    def __get_comments(self, id):
      submission = self.reddit.submission(id=id)
      submission.comments.replace_more(limit=5)
      
      for comment in submission.comments.list():
        yield comment.body