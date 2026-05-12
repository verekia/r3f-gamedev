docker buildx build --platform linux/arm64 --load -t verekia/r3f-gamedev .
docker save verekia/r3f-gamedev | gzip > /tmp/r3f-gamedev.tar.gz
scp /tmp/r3f-gamedev.tar.gz midgar:/tmp/
ssh midgar docker load --input /tmp/r3f-gamedev.tar.gz
ssh midgar docker compose up -d r3f-gamedev