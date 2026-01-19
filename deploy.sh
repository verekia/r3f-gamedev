docker buildx build --platform linux/arm64 --load -t verekia/r3f-gamedev .
docker save -o /tmp/r3f-gamedev.tar verekia/r3f-gamedev
scp /tmp/r3f-gamedev.tar midgar:/tmp/
ssh midgar docker load --input /tmp/r3f-gamedev.tar
ssh midgar docker compose up -d r3f-gamedev